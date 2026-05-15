export interface Plan {
  id: string;
  planCode: string;
  name: string;
  description: string;
  durationDays: number;
  price: number;
  discountPrice: number;
  savings: number;
  features: string[];
  maxListings: number;
  maxImages: number;
  featuredListing: boolean;
  prioritySupport: boolean;
  isActive: boolean;
  isPopular: boolean;
  createdAt: string;
}

export interface CreatePlan {
  planCode: string;
  name: string;
  description: string;
  durationDays: number;
  price: number;
  discountPrice: number;
  features: string[];
  maxListings: number;
  maxImages: number;
  featuredListing: boolean;
  prioritySupport: boolean;
  isActive: boolean;
  isPopular: boolean;
}