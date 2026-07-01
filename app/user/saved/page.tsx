"use client";

import {
  Heart,
  Trash2,
  MapPin,
  Phone,
  Globe,
  Search,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Listing } from "@/types/Listing";
import { listingService } from "@/service/apis/listing.service";

export default function SavedPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await listingService.getListing({
        pageNumber: 1,
        pageSize: 6,
      });
      if (response.data?.success) {
        setListings(response.data?.data?.data ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch listings: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      // Replace with your actual unsave/delete API call e.g.:
      // await listingService.unsaveListing(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (error) {
      console.error("Failed to remove listing: ", error);
    } finally {
      setRemovingId(null);
    }
  };

  const filteredListings = listings.filter((listing) => {
    const q = searchQuery.toLowerCase();
    return (
      listing.businessName.toLowerCase().includes(q) ||
      listing.categoryName.toLowerCase().includes(q) ||
      listing.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Saved Listings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your bookmarked businesses
        </p>
      </div>

      {/* Stats */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">Total Saved</p>
        <p className="mt-2 text-3xl font-bold text-red-600">
          {loading ? "—" : listings.length}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search saved listings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Content */}
      {loading ? (
        /* Loading state */
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">Loading saved listings…</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48 w-full bg-secondary overflow-hidden">
                  <img
                    src={
                      listing.images?.[0] ||
                      "https://via.placeholder.com/400x300"
                    }
                    alt={listing.businessName}
                    className="h-full w-full object-cover hover:scale-105 transition-transform"
                  />
                  {/* Unsave button */}
                  <button
                    onClick={() => handleRemove(listing.id)}
                    disabled={removingId === listing.id}
                    className="absolute top-3 right-3 h-10 w-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors disabled:opacity-60"
                    title="Remove from saved"
                  >
                    {removingId === listing.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Heart className="h-5 w-5 fill-current" />
                    )}
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <Link
                    href={`/listings/${listing.id}`}
                    className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                  >
                    {listing.businessName}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1">
                    {listing.categoryName}
                  </p>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 mt-3 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {listing.city}, {listing.state}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-sm font-medium text-foreground">
                      {listing.rating}
                      <span className="text-yellow-500 ml-1">★</span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({listing.reviewCount}{" "}
                      {listing.reviewCount === 1 ? "review" : "reviews"})
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <a
                      href={`tel:${listing.contactNumber}`}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </a>

                    {listing.website ? (
                      <a
                        href={listing.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        Website
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground opacity-50 cursor-not-allowed"
                      >
                        <Globe className="h-4 w-4" />
                        Website
                      </button>
                    )}

                    <button
                      onClick={() => handleRemove(listing.id)}
                      disabled={removingId === listing.id}
                      title="Remove from saved"
                      className="rounded-lg border border-destructive/20 px-3 py-2 text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                    >
                      {removingId === listing.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Empty state — adapts to search vs truly empty */
            <div className="col-span-full flex flex-col items-center justify-center py-16 gap-4 text-center">
              <Heart className="h-12 w-12 text-muted-foreground" />
              {searchQuery ? (
                <>
                  <p className="text-base font-medium text-foreground">
                    No results for &ldquo;{searchQuery}&rdquo;
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try a different business name, category, or city.
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-1 text-sm text-primary hover:underline"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <p className="text-base font-medium text-foreground">
                    No saved listings yet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tap the heart on any listing to save it here.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
