import { createProduct } from "@/types/Product";
import { publicClient } from "../apiClient";

export const productService = {
    getProducts: () => publicClient.get('/Product'),
    createProduct: (data: createProduct) => publicClient.post('/Product', data),
    getProductById: (id: string) => publicClient.get(`/Product/${id}`),
    updateProduct: (id: string, data: createProduct) => publicClient.put(`/Product/${id}`, data),
    deleteProduct: (id: string) => publicClient.delete(`/Product/${id}`),
    getBySubCategory: (subCategoryId: string) => publicClient.get(`/Product/subcategory/${subCategoryId}`),
    getProductByCategory: (categoryId: string) => publicClient.get(`/Product/category/${categoryId}`),
    getProductByListing: (listingId: string) => publicClient.get(`/Product/listing/${listingId}`),
    getFeaturedProducts: () => publicClient.get('/Product/featured'),
    getProductByStatus: (status: string) => publicClient.get(`/Product/status/${status}`),
    getProductBySearch: (query: string) => publicClient.get(`/Product/search`, { params: { keyword: query } })
}