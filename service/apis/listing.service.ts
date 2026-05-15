import { CreateListing } from "@/types/Listing";
import { privateClient, publicClient } from "../apiClient";

export const listingService = {
    createListing: (data: CreateListing) => privateClient.post('/Listing', data,),
    getListing: () => publicClient.get('/Listing'),
    getListingById: (id: string) => publicClient.get(`/Listing/${id}`),
    updateListing: (id: string, data: CreateListing) => privateClient.put(`/Listing/${id}`, data),
    deleteListing: (id: string) => privateClient.delete(`/Listing/${id}`),
    getListingByCategory: (categoryId: string) => publicClient.get(`/Listing/category/${categoryId}`),
    getFeaturedListings: () => publicClient.get('/Listing/featured'),
    getListingByStatus: (status: string) => publicClient.get(`/Listing/status/${status}`),
    getListingBySearch: (query: string) => publicClient.get(`/Listing/search`, { params: { keyword: query } }),
    updateStatus: (id: string, status: string) => privateClient.patch(`/Listing/${id}/status`, { status }),
}