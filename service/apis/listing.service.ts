import { CreateListing } from "@/types/Listing";
import { privateClient, publicClient } from "../apiClient";

interface getListingParams {
    pageNumber: number;
    pageSize: number;
    categoryId: string;
    status: "Active"| "Pending"| "Rejected"| "Expired";
    search: string;
    isFeatured: boolean;
}
export const listingService = {
    createListing: (data: CreateListing) => privateClient.post('/Listing', data,),
    getListing: (params: getListingParams) => publicClient.get('/Listing', {params}),
    getListingById: (id: string) => publicClient.get(`/Listing/${id}`),
    updateListing: (id: string, data: CreateListing) => privateClient.put(`/Listing/${id}`, data),
    deleteListing: (id: string) => privateClient.delete(`/Listing/${id}`),
    updateStatus: (id: string, status: string) => privateClient.patch(`/Listing/${id}/status`, { status }),
}