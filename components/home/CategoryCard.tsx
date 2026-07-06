import { Category } from "@/types/Category";
import Link from "next/link";
import Image from "next/image";

interface CategoryCardProps {
  category: Category;
  variant?: "default" | "compact";
}

export function CategoryCard({
  category,
  variant = "default",
}: CategoryCardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={`/listings?category=${category.name}`}
        className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/30 hover:shadow-md"
      >
        <Image
          src={category.imageUrl}
          alt={category.name}
          width={56}
          height={56}
          className="h-10 w-10 shrink-0 rounded-lg object-cover"
        />

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {category.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {category.listingCount} listings
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/listings?category=${category.name}`}
      className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary/30 hover:shadow-lg"
    >
      <Image
        src={category.imageUrl}
        alt={category.name}
        width={56}
        height={56}
        className="h-14 w-14 rounded-xl object-cover transition-transform group-hover:scale-105"
      />

      <div>
        <h3 className="text-sm font-semibold text-foreground">
          {category.name}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {category.listingCount} listings
        </p>
      </div>
    </Link>
  );
}
