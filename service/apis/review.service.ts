import { createReview } from "@/types/Review";
import { privateClient, publicClient } from "../apiClient";

export const reviewService = {
    getReviewsByListing: (listingId: string) => publicClient.get(`/Review/listing/${listingId}`),
    createReview: (data:createReview) => privateClient.post('/Review', data),
    deleteReview: (id: string) => privateClient.delete(`/Review/${id}`)
}