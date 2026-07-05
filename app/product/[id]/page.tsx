"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ShoppingCart, Star } from "lucide-react";
import { Product } from "@/types/Product";
import { productService } from "@/service/apis/product.service";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  const fetchProduct = async () => {
    if (!params?.id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getProductById(params.id);

      // API shape: { success, message, data: Product }
      const data: Product | undefined = response.data?.data;
      if (!data) {
        setError("Product not found.");
        setProduct(null);
        return;
      }
      setProduct(data);
      setActiveImage(0);
    } catch (err) {
      console.error("Failed to fetch product: ", err);
      setError("Failed to load this product. Please try again.");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const discountPercent = (prod: Product) =>
    prod.discountPrice && prod.discountPrice < prod.price
      ? Math.round(((prod.price - prod.discountPrice) / prod.price) * 100)
      : 0;

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="text-destructive">{error ?? "Product not found."}</p>
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={fetchProduct}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Retry
          </button>
          <Link
            href="/products"
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const discount = discountPercent(product);
  const displayPrice = discount > 0 ? product.discountPrice : product.price;
  const images = product.images?.length ? product.images : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image gallery */}
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-secondary">
            {images.length > 0 ? (
              <img
                src={images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                No image available
              </div>
            )}
            {product.featured && (
              <div className="absolute right-3 top-3 rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                Featured
              </div>
            )}
            {discount > 0 && (
              <div className="absolute left-3 top-3 rounded-lg bg-india-green px-2.5 py-1 text-xs font-semibold text-white">
                -{discount}%
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                    i === activeImage ? "border-primary" : "border-border"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {product.businessName}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-3xl font-bold text-foreground">
              ₹{displayPrice}
            </span>
            {discount > 0 && (
              <span className="text-lg text-muted-foreground line-through">
                ₹{product.price}
              </span>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
              {product.category}
            </span>
            {product.subcategory && (
              <span className="rounded-full bg-secondary px-3 py-1 font-medium text-foreground">
                {product.subcategory}
              </span>
            )}
            <span
              className={`rounded-full px-3 py-1 font-medium ${
                product.stock > 0
                  ? "bg-india-green/10 text-india-green"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <button
            onClick={() => alert(`Added "${product.name}" to cart`)}
            disabled={product.stock <= 0}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>

          {product.sku && (
            <p className="mt-4 text-xs text-muted-foreground">
              SKU: {product.sku}
            </p>
          )}

          {product.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Long description */}
      {product.longDescription && (
        <div className="mt-12 border-t border-border pt-8">
          <h2 className="text-xl font-bold text-foreground">Product Details</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {product.longDescription}
          </p>
        </div>
      )}

      {/* Specifications */}
      {product.specifications &&
        Object.keys(product.specifications).length > 0 && (
          <div className="mt-10 border-t border-border pt-8">
            <h2 className="text-xl font-bold text-foreground">
              Specifications
            </h2>
            <dl className="mt-4 divide-y divide-border rounded-lg border border-border">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="grid grid-cols-2 gap-4 px-4 py-3 text-sm"
                >
                  <dt className="font-medium text-foreground">{key}</dt>
                  <dd className="text-muted-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
    </div>
  );
}
