import { privateClient } from "../apiClient";
import { CreateTouristPlace } from "@/types/TouristPlaces";

interface  getTouristParams {
    pageNumber: number;
    pageSize: number;
    city?: string;
    state?: string;
    category?: string;
    isFeatured?: boolean;
    status?: 'Active'| 'Inactive'| 'Pending'| 'Draft';
    keyword?:string;
}
export const touristService = {
    getTouristPlaces :(params: getTouristParams) => privateClient.get('/Tourist',{params} ),
    createTouristPlace: (data:CreateTouristPlace) => privateClient.post('/Trourist', data),
    updateTouristPlace: (id:string, data:CreateTouristPlace) => privateClient.put(`/Tourist/${id}`, data), 
    deleteTouristPlace: (id:string) => privateClient.delete(`/Tourist/${id}`),
    getById: (id:string) => privateClient.get(`/Tourist/${id}`),
}