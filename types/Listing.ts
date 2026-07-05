export interface Listing {
  id: string;
  businessName: string;
  slug: string;
  description: string;
  contactNumber: string;
  email: string;
  website: string;
  categoryId: string;
  categoryName: string;
  status: string;
  featured: boolean;
  verified: boolean;
  viewCount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  addressLine1: string;
  addressLine2?: string;
  area: string;
  district: string;
  city: string;
  state: string;
  pinCode: string;
  createdAt: string;
}

export interface CreateListing {
  businessName: string;
  description: string;
  contactNumber: string;
  email: string;
  website: string;
  categoryId: string;
  categoryName: string;
  images: string[];
  addressLine1: string;
  addressLine2?: string;
  area: string;
  district: string;
  city: string;
  state: string;
  pinCode: string;
  featured?: boolean;
}