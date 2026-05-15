export interface Product {
  id: string;
  listingId: string;
  businessName: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  discountPrice: number;
  category: string;
  subcategory: string;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  status: "active" | "inactive" | "draft";
  featured: boolean;
  sku: string;
  tags: string[];
  specifications: Record<string, string>;
  createdAt: string; // or Date if you parse it
  updatedAt: string; // or Date if you parse it
}

export interface createProduct {
  listingId: string;
  businessName: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  discountPrice: number;
  category: string;
  subcategory: string;
  images: string[];
  stock: number;
  featured: boolean;
  sku: string;
  tags: string[];
  specifications: Record<string, string>;
}