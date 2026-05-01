"use client";

import { Heart, Trash2, MapPin, Phone, Globe, Search } from "lucide-react";
import { useState } from "react";
import { listings } from "@/data/listings";
import Link from "next/link";

export default function SavedPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const savedListings = listings.slice(0, 6);

  const filteredListings = savedListings.filter((listing) => {
    return (
      listing.businessName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      listing.categoryName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      listing.city.toLowerCase().includes(searchQuery.toLowerCase())
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
          {savedListings.length}
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

      {/* Saved Listings Grid */}
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
                  src={listing.images?.[0] || "https://via.placeholder.com/400x300"}
                  alt={listing.businessName}
                  className="h-full w-full object-cover hover:scale-105 transition-transform"
                />
                <button className="absolute top-3 right-3 h-10 w-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors">
                  <Heart className="h-5 w-5 fill-current" />
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
                  <MapPin className="h-4 w-4" />
                  <span>
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
                    ({listing.reviewCount})
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                    <Phone className="h-4 w-4" />
                    Call
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                    <Globe className="h-4 w-4" />
                    Website
                  </button>
                  <button className="rounded-lg border border-destructive/20 px-3 py-2 text-destructive hover:bg-destructive/10 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No saved listings found</p>
          </div>
        )}
      </div>
    </div>
  );
}
