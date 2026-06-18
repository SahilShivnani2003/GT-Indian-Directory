import { CreateCategory } from "@/types/Category";
import { privateClient } from "../apiClient";

export const categoryService  = {
    createCategory: (data:CreateCategory) => privateClient.post('/Category', data),
    getCategories: (params: {
        isAcitve: boolean;
    }) => privateClient.get('/Category', {params}),
    getCategoryById: (id: string) => privateClient.get(`/Category/${id}`),
    updateCategory: (id: string, data: CreateCategory) => privateClient.put(`/Category/${id}`, data),
    deleteCategory: (id: string) => privateClient.delete(`/Category/${id}`),
}