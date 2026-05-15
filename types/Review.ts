export interface Review {
  id: string;
  listingId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface createReview {
  listingId: string;
  userId: string;
  rating: number;
  comment: string;
}