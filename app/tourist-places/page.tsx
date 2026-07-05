"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Loader2, AlertCircle } from "lucide-react";
import { TouristPlace } from "@/types/TouristPlaces";
import { touristService } from "@/service/apis/tourist.service";

const PAGE_SIZE = 60;
const FILTER_OPTIONS_PAGE_SIZE = 1000;

export default function TouristPlacesPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [places, setPlaces] = useState<TouristPlace[]>([]);
  const [filterSource, setFilterSource] = useState<TouristPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch a broad, unfiltered set once on mount to populate the
  // category/state dropdown options.
  useEffect(() => {
    let isMounted = true;

    const fetchFilterOptions = async () => {
      try {
        const res = await touristService.getTouristPlaces({
          pageNumber: 1,
          pageSize: FILTER_OPTIONS_PAGE_SIZE,
          status: "Active",
        });
        if (isMounted) setFilterSource(res.data?.data?.data);
      } catch (err) {
        // Non-fatal: if this fails the dropdowns are just empty, the
        // main listing below still works.
        console.error("Failed to load filter options", err);
      }
    };

    fetchFilterOptions();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch the filtered, paginated list whenever a filter changes.
  useEffect(() => {
    let isMounted = true;

    const fetchPlaces = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await touristService.getTouristPlaces({
          pageNumber: 1,
          pageSize: PAGE_SIZE,
        });
        console.log('response : ', res.data)
        if (isMounted) setPlaces(res.data?.data?.data);
      } catch (err) {
        console.error("Failed to load tourist places", err);
        if (isMounted) {
          setError("Something went wrong while loading tourist places.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPlaces();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedState]);

  const categories = useMemo(
    () => Array.from(new Set(filterSource.map((p) => p.category))).sort(),
    [filterSource],
  );
  const states = useMemo(
    () => Array.from(new Set(filterSource.map((p) => p.state))).sort(),
    [filterSource],
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-saffron/10 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-4xl font-bold text-foreground">
            Explore Tourist Places in India
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Discover the most beautiful and iconic destinations across India
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-card py-6">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Filter by
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">All States</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Tourist Places Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          {isLoading ? (
            <div className="flex min-h-96 items-center justify-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading tourist places...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-96 items-center justify-center rounded-lg border border-dashed border-destructive/40 bg-destructive/5">
              <div className="text-center">
                <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
                <h3 className="text-lg font-semibold text-foreground">
                  Couldn&apos;t load tourist places
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          ) : places.length === 0 ? (
            <div className="flex min-h-96 items-center justify-center rounded-lg border border-dashed border-border bg-secondary/30">
              <div className="text-center">
                <MapPin className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground">
                  No places found
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try adjusting your filters
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {places.map((place) => (
                <div
                  key={place.id}
                  className="overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-secondary">
                    {place.image ? (
                      <Image
                        src={place.image}
                        alt={place.name}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <MapPin className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    {place.featured && (
                      <div className="absolute right-2 top-2 rounded-full bg-saffron px-3 py-1 text-xs font-semibold text-saffron-foreground">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-foreground">
                      {place.name}
                    </h3>

                    {/* Location */}
                    <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {place.city}, {place.state}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="mt-2 flex items-center gap-1">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(place.rating)
                                ? "fill-saffron text-saffron"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {place.rating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({place.reviewCount})
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                      {place.description}
                    </p>

                    {/* Info Grid */}
                    <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4 text-xs">
                      <div>
                        <div className="font-semibold text-foreground">
                          Best Time
                        </div>
                        <div className="text-muted-foreground">
                          {place.bestTimeToVisit}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          Entry Fee
                        </div>
                        <div className="truncate text-muted-foreground">
                          {place.entryFee}
                        </div>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <Link
                      href={`/tourist-places/${place.id}`}
                      className="mt-4 block w-full rounded-lg bg-primary py-2 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
