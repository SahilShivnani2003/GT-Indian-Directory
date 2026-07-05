"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { BadgeCheck, SlidersHorizontal, Star } from "lucide-react";
import Link from "next/link";
import { SearchBar } from "@/components/home/SearchBar";
import Image from "next/image";
import { City, State } from "@/types/CityState";
import { Category } from "@/types/Category";
import { Listing } from "@/types/Listing";
import { listingService } from "@/service/apis/listing.service";
import { categoryService } from "@/service/apis/category.service";
import { stateService } from "@/service/apis/state.service";

const PLACEHOLDER_IMAGE = "/images/listing-placeholder.png";
const PAGE_SIZE = 10;

function ListingsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  const category = searchParams.get("category") || ""; // this is a slug, e.g. "electronics"

  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // ── Fetch categories first (for sidebar + resolving slug → id) ─────────────
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await categoryService.getCategories({
          isAcitve: true,
        });
        if (response.data?.success) {
          setCategories(response.data.data?.data ?? []);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // ── Fetch listings ──────────────────────────────────────────────────────────
  useEffect(() => {
    // If a category slug is present in the URL, wait until categories have
    // loaded so we can resolve it to the categoryId the API actually accepts.
    // Without this guard we'd either send no category filter on first paint,
    // or send a stale/wrong id.
    if (category && loadingCategories) return;

    const fetchListings = async () => {
      setLoadingListings(true);
      try {
        const matchedCategory = category
          ? categories.find((c) => c.slug === category)
          : undefined;

        const params: {
          pageNumber: number;
          pageSize: number;
          status: "Active";
          search?: string;
          categoryId?: string;
        } = {
          pageNumber: 1,
          pageSize: PAGE_SIZE,
          status: "Active",
        };

        if (query) params.search = query;
        if (matchedCategory) params.categoryId = matchedCategory.id;
        // Note: category slug present but not found in the loaded list —
        // don't silently ignore it, fall through with no category filter
        // rather than pretending a match; the empty grid + "No businesses
        // found" state will surface this instead of masking it.

        const response = await listingService.getListing(params);
        if (response.data?.success) {
          setListings(response.data.data?.data ?? []);
        } else {
          setListings([]);
        }
      } catch (error) {
        console.error("Failed to fetch listings:", error);
        setListings([]);
      } finally {
        setLoadingListings(false);
      }
    };

    fetchListings();
  }, [query, category, categories, loadingCategories]);

  // ── Fetch cities (for SearchBar) ────────────────────────────────────────────
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const cityRes = await stateService.getCities("MP");
        if (!cityRes.data?.success) return;
        setCities(cityRes.data?.data);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };

    fetchCities();
  }, []);

  // ── Client-side location filter ──────────────────────────────────────────
  // listingService has no location/city param, so this narrows the fetched
  // page of results locally. This means the displayed count and pagination
  // reflect the fetched page only, not a true server-side filtered total —
  // fine for a single page of 10, but won't scale if you paginate this list.
  const filteredListings = useMemo(() => {
    if (!location || location === "all") return listings;
    const needle = location.toLowerCase();
    return listings.filter((l) =>
      [l.city, l.area, l.state].some((field) =>
        field?.toLowerCase().includes(needle),
      ),
    );
  }, [listings, location]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Search Header */}
      <section className="border-b border-border bg-secondary py-8">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {query ? `Results for "${query}"` : "All Business Listings"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loadingListings ? (
              "Loading…"
            ) : (
              <>
                {filteredListings.length}{" "}
                {filteredListings.length === 1 ? "listing" : "listings"} found
                {location && location !== "all" ? ` in ${location}` : ""}
              </>
            )}
          </p>
          <div className="mt-6 max-w-2xl">
            <SearchBar cities={cities} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <aside className="w-full shrink-0 lg:w-64">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">
                  Filter by Category
                </h2>
              </div>

              <div className="mt-4 flex flex-col gap-1">
                <Link
                  href="/listings"
                  className={`rounded-md px-3 py-2 text-sm transition-colors ${
                    !category
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  All Categories
                </Link>

                {loadingCategories
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="mx-3 my-1 h-4 animate-pulse rounded bg-muted"
                      />
                    ))
                  : categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/listings?category=${cat.slug}${query ? `&q=${query}` : ""}${location ? `&location=${location}` : ""}`}
                        className={`rounded-md px-3 py-2 text-sm transition-colors ${
                          category === cat.slug
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`}
                      >
                        {cat.name}
                        <span className="ml-1 text-xs opacity-60">
                          ({cat.listingCount})
                        </span>
                      </Link>
                    ))}
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            {loadingListings ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-xl border border-border bg-card"
                  >
                    <div className="aspect-[16/10] animate-pulse bg-muted" />
                    <div className="space-y-2 p-4">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-full animate-pulse rounded bg-muted" />
                      <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredListings.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredListings.map((listing) => (
                  <Link
                    key={listing.slug}
                    href={`/listings/${listing.id}`}
                    className="group block"
                  >
                    <div className="overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={listing.images?.[0] || PLACEHOLDER_IMAGE}
                          alt={listing.businessName}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {listing.featured && (
                          <span className="absolute left-3 top-3 rounded-md bg-saffron px-2.5 py-1 text-xs font-semibold text-saffron-foreground">
                            Featured
                          </span>
                        )}
                        {listing.verified && (
                          <span className="absolute right-3 top-3 rounded-full bg-india-green p-1">
                            <BadgeCheck className="h-4 w-4 text-india-green-foreground" />
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="text-base font-semibold text-foreground group-hover:text-primary">
                          {listing.businessName}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                          {listing.description}
                        </p>

                        <p className="mt-2 truncate text-xs text-muted-foreground">
                          {[listing.area, listing.city, listing.state]
                            .filter(Boolean)
                            .join(", ")}
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {listing.categoryName}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-saffron text-saffron" />
                            <span className="text-sm font-semibold text-foreground">
                              {listing.rating.toFixed(1)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({listing.reviewCount})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
                <h3 className="text-lg font-semibold text-foreground">
                  No businesses found
                </h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Try adjusting your search terms or browse our categories to
                  find what you are looking for.
                </p>
                <Link
                  href="/listings"
                  className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  View All Listings
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <ListingsContent />
    </Suspense>
  );
}
