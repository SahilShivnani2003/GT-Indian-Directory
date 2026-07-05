"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  Ticket,
  Phone,
  Globe,
  CalendarDays,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { TouristPlace } from "@/types/TouristPlaces";
import { touristService } from "@/service/apis/tourist.service";

export default function TouristPlaceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [place, setPlace] = useState<TouristPlace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  const fetchPlace = async () => {
    if (!params?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await touristService.getById(params.id);

      if (!res.data?.success) {
        setError("Tourist place not found.");
        setPlace(null);
        return;
      }

      const data: TouristPlace | undefined = res.data?.data;
      if (!data) {
        setError("Tourist place not found.");
        setPlace(null);
        return;
      }
      setPlace(data);
      setActiveImage(0);
    } catch (err) {
      console.error("Failed to load tourist place", err);
      setError("Something went wrong while loading this place.");
      setPlace(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading tourist place...</span>
        </div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
        <h1 className="text-lg font-semibold text-foreground">
          {error ?? "Tourist place not found."}
        </h1>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={fetchPlace}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Retry
          </button>
          <Link
            href="/tourist-places"
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            Back to Tourist Places
          </Link>
        </div>
      </div>
    );
  }

  const gallery = place.image ? [place.image, ...place.images] : place.images;
  const hasCoordinates = !!place.latitude && !!place.longitude;

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
            {gallery.length > 0 ? (
              <Image
                src={gallery[activeImage]}
                alt={place.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <MapPin className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
            {place.featured && (
              <div className="absolute right-3 top-3 rounded-full bg-saffron px-3 py-1 text-xs font-semibold text-saffron-foreground">
                Featured
              </div>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                    i === activeImage ? "border-primary" : "border-border"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${place.name} ${i + 1}`}
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
            {place.category}
          </span>

          <h1 className="mt-3 text-3xl font-bold text-foreground">
            {place.name}
          </h1>

          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>
              {[place.location, place.city, place.state]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-1">
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
              ({place.reviewCount} reviews)
            </span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {place.description}
          </p>

          {/* Info grid */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            {place.bestTimeToVisit && (
              <InfoCard
                icon={
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                }
                label="Best Time to Visit"
                value={place.bestTimeToVisit}
              />
            )}
            {place.entryFee && (
              <InfoCard
                icon={<Ticket className="h-5 w-5 text-muted-foreground" />}
                label="Entry Fee"
                value={place.entryFee}
              />
            )}
            {place.openingHours && (
              <InfoCard
                icon={<Clock className="h-5 w-5 text-muted-foreground" />}
                label="Opening Hours"
                value={place.openingHours}
              />
            )}
            {place.contactNumber && (
              <InfoCard
                icon={<Phone className="h-5 w-5 text-muted-foreground" />}
                label="Contact"
                value={place.contactNumber}
                href={`tel:${place.contactNumber}`}
              />
            )}
          </div>

          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary"
            >
              <Globe className="h-5 w-5 text-muted-foreground" />
              <span className="truncate text-sm font-medium text-foreground">
                {place.website}
              </span>
            </a>
          )}

          {hasCoordinates && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <MapPin className="h-4 w-4" />
              Open in Google Maps
            </a>
          )}
        </div>
      </div>

      {/* Long description */}
      {place.longDescription && (
        <div className="mt-12 border-t border-border pt-8">
          <h2 className="text-xl font-bold text-foreground">
            About {place.name}
          </h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {place.longDescription}
          </p>
        </div>
      )}
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
      {icon}
      <div>
        <div className="text-xs font-semibold text-foreground">{label}</div>
        <div className="mt-0.5 text-sm text-muted-foreground">{value}</div>
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="transition-colors hover:border-primary">
      {content}
    </a>
  ) : (
    content
  );
}
