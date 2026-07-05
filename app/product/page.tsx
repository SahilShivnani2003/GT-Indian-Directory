"use client";

import Link from "next/link";
import { Search, Star, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Product } from "@/types/Product";
import { productService } from "@/service/apis/product.service";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getProducts({
        pageNumber: 1,
        pageSize: 50,
      });

      // API shape: { success, message, data: { data: Product[], pageNumber, ... } }
      const data: Product[] = response.data?.data?.data ?? [];
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products: ", error);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  const discountPercent = (prod: Product) =>
    prod.discountPrice && prod.discountPrice < prod.price
      ? Math.round(((prod.price - prod.discountPrice) / prod.price) * 100)
      : 0;

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-4xl font-bold text-foreground">
            Buy Products & Services
          </h1>
          <p className="mt-2 text-muted-foreground">
            Discover amazing products from trusted businesses
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col gap-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products, services, businesses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background text-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {cat === "all" ? "All Products" : cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="bg-background py-12">
        <div className="mx-auto max-w-6xl px-4">
          {loading ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-destructive">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                No products found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} products found
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group rounded-lg border border-border bg-card transition-all hover:border-primary hover:shadow-lg"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-secondary">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                      {product.featured && (
                        <div className="absolute right-2 top-2 rounded-lg bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                          Featured
                        </div>
                      )}
                      {discountPercent(product) > 0 && (
                        <div className="absolute left-2 top-2 rounded-lg bg-india-green px-2 py-1 text-xs font-semibold text-white">
                          -{discountPercent(product)}%
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <p className="text-xs font-medium text-muted-foreground">
                        {product.businessName}
                      </p>

                      <h3 className="mt-1 line-clamp-2 text-sm font-bold text-foreground group-hover:text-primary">
                        {product.name}
                      </h3>

                      <div className="mt-2 flex items-center gap-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(product.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviewCount})
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-lg font-bold text-foreground">
                          ₹
                          {discountPercent(product) > 0
                            ? product.discountPrice
                            : product.price}
                        </span>
                        {discountPercent(product) > 0 && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{product.price}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Added "${product.name}" to cart`);
                        }}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
