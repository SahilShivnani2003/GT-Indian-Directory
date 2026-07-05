"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Star,
  Phone,
  Mail,
  Globe,
  MapPin,
} from "lucide-react";
import { Listing } from "@/types/Listing";
import { listingService } from "@/service/apis/listing.service";

const PLACEHOLDER_IMAGE = "/images/listing-placeholder.png";

export default function ListingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  const fetchListing = async () => {
    if (!params?.id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await listingService.getListingById(params.id);

      if (!response.data?.success) {
        setError("Listing not found.");
        setListing(null);
        return;
      }

      const data: Listing | undefined = response.data?.data;
      if (!data) {
        setError("Listing not found.");
        setListing(null);
        return;
      }
      setListing(data);
      setActiveImage(0);
    } catch (err) {
      console.error("Failed to fetch listing:", err);
      setError("Failed to load this listing. Please try again.");
      setListing(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Loading listing...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="text-destructive">{error ?? "Listing not found."}</p>
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={fetchListing}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Retry
          </button>
          <Link
            href="/listings"
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  const images = listing.images?.length ? listing.images : [PLACEHOLDER_IMAGE];
  const fullAddress = [
    listing.addressLine1,
    listing.addressLine2,
    listing.area,
    listing.district,
    listing.city,
    listing.state,
    listing.pinCode,
  ]
    .filter(Boolean)
    .join(", ");

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
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-secondary">
            <Image
              src={images[activeImage]}
              alt={listing.businessName}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {listing.featured && (
              <span className="absolute left-3 top-3 rounded-md bg-saffron px-2.5 py-1 text-xs font-semibold text-saffron-foreground">
                Featured
              </span>
            )}
            {listing.verified && (
              <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-india-green px-2.5 py-1 text-xs font-semibold text-india-green-foreground">
                <BadgeCheck className="h-4 w-4" />
                Verified
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                    i === activeImage ? "border-primary" : "border-border"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${listing.businessName} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {listing.categoryName}
          </span>

          <h1 className="mt-3 text-3xl font-bold text-foreground">
            {listing.businessName}
          </h1>

          <div className="mt-3 flex items-center gap-2">
            <Star className="h-5 w-5 fill-saffron text-saffron" />
            <span className="text-base font-semibold text-foreground">
              {listing.rating.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">
              ({listing.reviewCount} reviews)
            </span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {listing.description}
          </p>

          {/* Address */}
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-border bg-card p-4">
            <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
            <p className="text-sm text-foreground">{fullAddress}</p>
          </div>

          {/* Contact */}
          <div className="mt-4 space-y-3">
            {listing.contactNumber && (
              <a
                href={`tel:${listing.contactNumber}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary"
              >
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {listing.contactNumber}
                </span>
              </a>
            )}
            {listing.email && (
              <a
                href={`mailto:${listing.email}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary"
              >
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {listing.email}
                </span>
              </a>
            )}
            {listing.website && (
              <a
                href={listing.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary"
              >
                <Globe className="h-5 w-5 text-muted-foreground" />
                <span className="truncate text-sm font-medium text-foreground">
                  {listing.website}
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
