import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  MapPin,
  Home,
  DollarSign,
  Ruler,
  Bath,
  Bed,
  Heart,
} from "lucide-react";

const propertyTypes = [
  {
    id: 1,
    title: "Residential",
    description: "Apartments, villas, and houses",
    icon: Home,
    color: "bg-blue-50",
  },
  {
    id: 2,
    title: "Commercial",
    description: "Offices, shops, and warehouses",
    icon: Ruler,
    color: "bg-amber-50",
  },
  {
    id: 3,
    title: "Land",
    description: "Plots and agricultural land",
    icon: MapPin,
    color: "bg-green-50",
  },
];

const properties = [
  {
    id: 1,
    title: "Modern 3 BHK Apartment in Whitefield",
    location: "Whitefield, Bangalore",
    price: "₹1.2 Cr",
    bedrooms: 3,
    bathrooms: 2,
    area: 1450,
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&auto=format&fit=crop&q=60",
    featured: true,
    type: "Residential",
  },
  {
    id: 2,
    title: "Premium Office Space in MG Road",
    location: "MG Road, Bangalore",
    price: "₹45 L",
    bedrooms: 0,
    bathrooms: 2,
    area: 1200,
    image:
      "https://images.unsplash.com/photo-1497366216548-495519410acb?w=500&auto=format&fit=crop&q=60",
    featured: false,
    type: "Commercial",
  },
  {
    id: 3,
    title: "Spacious Villa with Garden in Indiranagar",
    location: "Indiranagar, Bangalore",
    price: "₹2.5 Cr",
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&auto=format&fit=crop&q=60",
    featured: true,
    type: "Residential",
  },
  {
    id: 4,
    title: "Retail Shop in Commercial Complex",
    location: "Koramangala, Bangalore",
    price: "₹25 L",
    bedrooms: 0,
    bathrooms: 1,
    area: 600,
    image:
      "https://images.unsplash.com/photo-1488554347313-80fcffe6f951?w=500&auto=format&fit=crop&q=60",
    featured: false,
    type: "Commercial",
  },
  {
    id: 5,
    title: "Residential Plot in Sarjapur Road",
    location: "Sarjapur, Bangalore",
    price: "₹80 L",
    bedrooms: 0,
    bathrooms: 0,
    area: 2400,
    image:
      "https://images.unsplash.com/photo-1500382017468-7049faf0d4e6?w=500&auto=format&fit=crop&q=60",
    featured: false,
    type: "Land",
  },
  {
    id: 6,
    title: "Luxury 2 BHK with Terrace",
    location: "Banaswadi, Bangalore",
    price: "₹95 L",
    bedrooms: 2,
    bathrooms: 2,
    area: 950,
    image:
      "https://images.unsplash.com/photo-1540932239986-310128078e6c?w=500&auto=format&fit=crop&q=60",
    featured: false,
    type: "Residential",
  },
];

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-r from-secondary to-secondary/50 px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Find Your Perfect Property
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Discover a wide range of residential, commercial, and land properties across India.
            Find your dream home or investment opportunity today.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="#properties"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse Properties
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/list-business"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Post Property
            </Link>
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Property Types
            </h2>
            <p className="mt-2 text-muted-foreground">
              Browse by category to find properties that suit your needs
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {propertyTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Link
                  key={type.id}
                  href={`#properties`}
                  className="group overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${type.color}`}
                  >
                    <Icon className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {type.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {type.description}
                  </p>
                  <ArrowRight className="mt-4 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section
        id="properties"
        className="border-t border-border bg-secondary/30 px-4 py-12 sm:py-16"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Featured Properties
              </h2>
              <p className="mt-2 text-muted-foreground">
                {properties.length} properties available
              </p>
            </div>
            <Link
              href="#"
              className="text-sm font-semibold text-primary hover:text-primary/80"
            >
              View All Filters
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-150 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-secondary">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {property.featured && (
                    <div className="absolute right-3 top-3 rounded-full bg-saffron px-3 py-1 text-xs font-semibold text-saffron-foreground shadow-md">
                      Featured
                    </div>
                  )}
                  <button className="absolute left-3 top-3 rounded-full bg-white/80 p-2 backdrop-blur-sm transition-colors hover:bg-white">
                    <Heart className="h-5 w-5 text-foreground" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-foreground line-clamp-2">
                    {property.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {property.location}
                  </div>

                  {/* Price and Type */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-bold text-foreground">
                        {property.price}
                      </span>
                    </div>
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      {property.type}
                    </span>
                  </div>

                  {/* Property Details */}
                  {(property.bedrooms > 0 || property.bathrooms > 0) && (
                    <div className="mt-4 flex gap-4 border-t border-border pt-4 text-sm">
                      {property.bedrooms > 0 && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Bed className="h-4 w-4" />
                          <span>{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms > 0 && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Bath className="h-4 w-4" />
                          <span>{property.bathrooms}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Ruler className="h-4 w-4" />
                        <span>{property.area} sqft</span>
                      </div>
                    </div>
                  )}
                  {property.bedrooms === 0 && property.bathrooms === 0 && (
                    <div className="mt-4 border-t border-border pt-4 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Ruler className="h-4 w-4" />
                        <span>{property.area} sqft</span>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-8 text-center">
            <Link
              href="#"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Load More Properties
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Why Choose Us?
            </h2>
            <p className="mt-2 text-muted-foreground">
              The best property listing platform in India
            </p>
          </div>

          <div className="space-y-4 sm:flex sm:gap-4 sm:space-y-0">
            {[
              {
                title: "Verified Properties",
                description: "All listings are verified for authenticity",
              },
              {
                title: "Easy Search",
                description: "Advanced filters to find your perfect property",
              },
              {
                title: "Expert Support",
                description: "Our team is here to assist you 24/7",
              },
              {
                title: "Best Deals",
                description: "Exclusive offers and discounts available",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex-1 rounded-xl border border-border bg-secondary/30 p-5 text-center"
              >
                <h3 className="text-sm font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-secondary/50 px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl bg-primary/10 p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Want to List Your Property?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Post your property for free and reach thousands of potential buyers and tenants.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/list-business"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Post Property Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
