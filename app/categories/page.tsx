"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { categoryService } from "@/service/apis/category.service";
import { Category } from "@/types/Category";
import { useEffect, useState } from "react";

const colorMap: Record<number, string> = {
  0: "bg-blue-50",
  1: "bg-teal-50",
  2: "bg-amber-50",
  3: "bg-rose-50",
  4: "bg-green-50",
  5: "bg-violet-50",
  6: "bg-pink-50",
  7: "bg-stone-100",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(()=>{
    fetchCategories();
  },[])

  const fetchCategories = async () => {
      try {
        console.log("Fetching categories");
        const response = await categoryService.getCategories({ isAcitve: true });
        if (response.data?.success) {
          console.log("Categories fetched successfully");
          setCategories(response.data?.data?.data ?? []);
        } else {
          setCategories([]);
        }
      } catch (error: unknown) {
        console.error("Failed to load category : ", error);
        setCategories([]);
      }
    };
    
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-secondary px-4 py-7">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
            All categories
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse businesses by industry and service type
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {categories ? categories.length : 0}  categories
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories && categories.map((category, i) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* Image area — tall enough to be seen */}
              <div
                className={`relative h-36 w-full overflow-hidden ${
                  colorMap[i % Object.keys(colorMap).length]
                }`}
              >
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Text */}
              <div className="flex flex-col gap-0.5 border-t border-border px-3 py-3">
                <h3 className="text-sm font-semibold leading-snug text-foreground">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {category.listingCount.toLocaleString()} listings
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-4 mb-8 mt-2">
        <div className="mx-auto max-w-6xl rounded-xl border border-border bg-secondary px-6 py-5">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                {"Can't find your category?"}
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                List your business and we'll add the right category for you
              </p>
            </div>
            <Link
              href="/list-business"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-xs font-semibold text-background transition-opacity hover:opacity-80"
            >
              List your business
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
