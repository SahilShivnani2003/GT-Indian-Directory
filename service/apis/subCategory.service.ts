import { CreateSubcategory } from "@/types/SubCategory";
import { privateClient } from "../apiClient";

export const subCategoryService = {
    createSubCategory: (data: CreateSubcategory) => privateClient.post('/SubCategory', data),
    getSubCategories: () => privateClient.get('/SubCategory'),
    getSubCategoryById: (id: string) => privateClient.get(`/SubCategory/${id}`),
    updateSubCategory: (id: string, data: CreateSubcategory) => privateClient.put(`/SubCategory/${id}`, data),
    deleteSubCategory: (id: string) => privateClient.delete(`/SubCategory/${id}`),
    getByCategory: (categoryId: string) => privateClient.get(`/SubCategory/category/${categoryId}`)
}