import { CreateBanner } from "@/types/Banner";
import { privateClient } from "../apiClient";

export const bannerService = {
    createBanner: (data: CreateBanner) => privateClient.post('/Banner', data),
    getBanners: () => privateClient.get('/Banner'),
    getBannerById: (id: string) => privateClient.get(`/Banner/${id}`),
    updateBanner: (id: string, data: CreateBanner) => privateClient.put(`/Banner/${id}`, data),
    deleteBanner: (id: string) => privateClient.delete(`/Banner/${id}`),
    getActiveBanners: () => privateClient.get('/Banner/active'),
    getRunningBanners: () => privateClient.get('/Banner/running'),
    getBannerByType: (type: string) => privateClient.get(`/Banner/type/${type}`),
}