import { CreateBanner } from "@/types/Banner";
import { privateClient } from "../apiClient";

interface getBannerParams {
    pageNumber: number;
    pageSize: number;
    IsActive?: boolean;
    IsRunning?: boolean;
    type?: "Promotional" | "Featured" | "Opportunity";
}
export const bannerService = {
    createBanner: (data: CreateBanner) => privateClient.post('/Banner', data),
    getBanners: (params: getBannerParams) => privateClient.get('/Banner', {params}),
    getBannerById: (id: string) => privateClient.get(`/Banner/${id}`),
    updateBanner: (id: string, data: CreateBanner) => privateClient.put(`/Banner/${id}`, data),
    deleteBanner: (id: string) => privateClient.delete(`/Banner/${id}`),
}