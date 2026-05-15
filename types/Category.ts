export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  slug?: string;
  listingCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateCategory {
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}