"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

import { BannerCarousel } from "@/components/home/BannerCoursol";
import { BusinessCard } from "@/components/home/BusinessCard";
import { CategoryCard } from "@/components/home/CategoryCard";
import { HeroBanner } from "@/components/home/HeroBanner";
import { SearchBar } from "@/components/home/SearchBar";
import { bannerService } from "@/service/apis/banner.service";
import { categoryService } from "@/service/apis/category.service";
import { listingService } from "@/service/apis/listing.service";
import { stateService } from "@/service/apis/state.service";
import { Banner } from "@/types/Banner";
import { Category } from "@/types/Category";
import { City } from "@/types/CityState";
import { Listing } from "@/types/Listing";

// Simple skeleton block, reuses existing design tokens
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-secondary ${className}`} />
  );
}

export default function HomePage() {
  const [cities, setCities] = useState<City[] | null>(null);
  const [banners, setBanners] = useState<Banner[] | null>(null);
  const [listings, setListings] = useState<Listing[] | null>(null); // featured
  const [allListings, setAllListings] = useState<Listing[] | null>(null); // all active
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    fetchCity();
    fetchBanners();
    fetchListings();
    fetchAllListings();
    fetchCategories();
  }, []);

  const fetchCity = async () => {
    try {
      console.log("Fetching cities");
      const response = await stateService.getCities("MP");
      if (response.data?.success) {
        console.log("cities fetched successfully.");
        setCities(response.data?.data);
      } else {
        setCities([]);
      }
    } catch (error: unknown) {
      console.error("Failed to fetch cities : ", error);
      setCities([]);
    }
  };

  const fetchBanners = async () => {
    try {
      console.log("Fetching banners");
      const response = await bannerService.getBanners({
        pageNumber: 1,
        pageSize: 10,
        IsRunning: true,
        IsActive: true,
      });
      if (response.data?.success) {
        console.log("Banners fetched successfully");
        setBanners(response.data?.data?.data ?? []);
      } else {
        setBanners([]);
      }
    } catch (error: unknown) {
      console.error("Failed to load banner : ", error);
      setBanners([]);
    }
  };

  const fetchListings = async () => {
    try {
      console.log("Fetching featured listings");
      const response = await listingService.getListing({
        pageNumber: 1,
        pageSize: 10,
        isFeatured: true,
        status: "Active",
      });
      if (response.data?.success) {
        console.log("Featured listings fetched successfully");
        setListings(response.data?.data?.data ?? []);
      } else {
        setListings([]);
      }
    } catch (error: unknown) {
      console.error("Failed to fetch featured listings : ", error);
      setListings([]);
    }
  };

  const fetchAllListings = async () => {
    try {
      console.log("Fetching all listings");
      const response = await listingService.getListing({
        pageNumber: 1,
        pageSize: 50,
        status: "Active",
      });
      if (response.data?.success) {
        console.log("All listings fetched successfully");
        setAllListings(response.data?.data?.data ?? []);
      } else {
        setAllListings([]);
      }
    } catch (error: unknown) {
      console.error("Failed to fetch all listings : ", error);
      setAllListings([]);
    }
  };

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
    <div>
      {/* Hero Section */}
      <section className="bg-secondary py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Discover Trusted Businesses
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Connect with verified professionals and services in your area
          </p>
          <div className="mt-8 flex justify-center">
            {cities ? (
              <SearchBar cities={cities} />
            ) : (
              <Skeleton className="h-12 w-full max-w-md" />
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Hero Banner */}
        <HeroBanner />

        {/* Banner Carousel */}
        <div className="mt-10">
          {banners ? (
            banners.length > 0 ? (
              <BannerCarousel banners={banners} />
            ) : null
          ) : (
            <Skeleton className="h-40 w-full" />
          )}
        </div>

        {/* Featured Businesses */}
        <section className="mt-14">
          <div className="flex items-start gap-3">
            <Star className="mt-0.5 h-6 w-6 fill-saffron text-saffron" />
            <div>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                Featured Businesses
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Verified and highly rated listings
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings === null ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))
            ) : listings.length > 0 ? (
              listings.map((listing) => (
                <BusinessCard key={listing.id} listing={listing} />
              ))
            ) : (
              <p className="col-span-full text-sm text-muted-foreground">
                No featured businesses right now. Check back soon.
              </p>
            )}
          </div>
        </section>

        {/* Browse Categories */}
        <section className="mt-14">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                Browse Categories
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Find businesses by industry
              </p>
            </div>
            <Link
              href="/categories"
              className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {categories === null ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))
            ) : categories.length > 0 ? (
              categories
                .slice(0, 12)
                .map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))
            ) : (
              <p className="col-span-full text-sm text-muted-foreground">
                No categories available.
              </p>
            )}
          </div>
        </section>

        {/* All Businesses */}
        <section className="mt-14">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                All Businesses
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {allListings === null
                  ? "Loading listings…"
                  : `${allListings.length} listings found`}
              </p>
            </div>
            <Link
              href="/listings"
              className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allListings === null ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))
            ) : allListings.length > 0 ? (
              allListings
                .slice(0, 6)
                .map((listing) => (
                  <BusinessCard key={listing.id} listing={listing} />
                ))
            ) : (
              <p className="col-span-full text-sm text-muted-foreground">
                No businesses found yet.
              </p>
            )}
          </div>
          {allListings && allListings.length > 6 && (
            <div className="mt-8 flex justify-center">
              <Link
                href="/listings"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                View All Listings
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
