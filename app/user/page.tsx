"use client";

import { listingService } from "@/service/apis/listing.service";
import { Listing } from "@/types/Listing";
import { ShoppingCart, Heart, MapPin, Star, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UserDashboard() {
  const [listings, setListings] = useState<Listing[]|null>(null);
  // Mock data
  const totalOrders = 12;
  const pendingOrders = 2;
  const completedOrders = 10;
  const savedListings = 8;
  const totalSpent = "₹45,250";

  useEffect(()=>{
    fetchListings();
  },[])
  const fetchListings = async() =>{
    try{
      console.log('Fetching listings');
      const response = await listingService.getListing({pageNumber: 1, pageSize: 6});
      if(response.data?.success){
        setListings(response.data?.data?.data);
      }

    }catch(error){
      console.error('Failed to load listings: ', error);
    }
  }
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-lg border border-border bg-linear-to-r from-primary/10 to-blue-500/10 p-6">
        <h2 className="text-2xl font-bold text-foreground">
          Welcome back!
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Orders */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{totalOrders}</p>
          <p className="mt-2 text-xs text-muted-foreground">All time</p>
        </div>

        {/* Pending Orders */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Pending</p>
            <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{pendingOrders}</p>
          <p className="mt-2 text-xs text-muted-foreground">In progress</p>
        </div>

        {/* Completed Orders */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Completed</p>
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">{completedOrders}</p>
          <p className="mt-2 text-xs text-muted-foreground">Delivered</p>
        </div>

        {/* Saved Listings */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Saved</p>
            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Heart className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600">{savedListings}</p>
          <p className="mt-2 text-xs text-muted-foreground">Bookmarked</p>
        </div>

        {/* Total Spent */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-600">{totalSpent}</p>
          <p className="mt-2 text-xs text-muted-foreground">Lifetime</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/user/orders"
          className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow group"
        >
          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">View Orders</h3>
          <p className="text-sm text-muted-foreground">
            Track and manage your purchases
          </p>
        </Link>

        <Link
          href="/user/saved"
          className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow group"
        >
          <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center mb-3 group-hover:bg-red-200 transition-colors">
            <Heart className="h-5 w-5 text-red-600" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">
            Saved Listings
          </h3>
          <p className="text-sm text-muted-foreground">
            View your bookmarked businesses
          </p>
        </Link>

        <Link
          href="/user/reviews"
          className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow group"
        >
          <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center mb-3 group-hover:bg-yellow-200 transition-colors">
            <Star className="h-5 w-5 text-yellow-600" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">My Reviews</h3>
          <p className="text-sm text-muted-foreground">
            Check your ratings and feedback
          </p>
        </Link>
      </div>

      {/* Recently Viewed */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="border-b border-border px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Featured Listings
          </h3>
          <Link
            href="/listings"
            className="text-sm font-medium text-primary hover:underline"
          >
            Browse All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
          {listings && listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/listings/${listing.id}`}
              className="group rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow bg-secondary/50"
            >
              <div className="relative h-40 w-full bg-secondary overflow-hidden">
                <img
                  src={listing.images?.[0] || "https://via.placeholder.com/400x300"}
                  alt={listing.businessName}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {listing.businessName}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {listing.categoryName}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs font-medium text-yellow-600">
                    {listing.rating}
                    <span className="text-yellow-500">★</span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({listing.reviewCount})
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
