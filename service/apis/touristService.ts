import { privateClient } from "../apiClient";
import { CreateTouristPlace } from "@/types/TouristPlaces";

export const touristService = {
    getTouristPlaces :() => privateClient.get('/Tourist'),
    createTouristPlace: (data:CreateTouristPlace) => privateClient.post('/Trourist', data),
    updateTouristPlace: (id:string, data:CreateTouristPlace) => privateClient.put(`/Tourist/${id}`, data), 
    deleteTouristPlace: (id:string) => privateClient.delete(`/Tourist/${id}`),
    getById: (id:string) => privateClient.get(`/Tourist/${id}`),
    getByState: (state:string) => privateClient.get(`/Tourist/state/${state}`),
    getByCategory: (category:string) => privateClient.get(`/Tourist/category/${category}`),
    getFeatured: () => privateClient.get('/Tourist/featured'),
    getByStatus: (status: "active" | "pending" | "inactive") => privateClient.get(`/Tourist/status/${status}`),
    getBySearch: (query:string) => privateClient.get(`/Tourist/search`, { params: { keyword: query } })
}