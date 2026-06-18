import { createProduct } from "@/types/Product";
import { publicClient } from "../apiClient";

interface getProductParams {
    pageNumber: number;
    pageSize: number;
    listingId?: string;
    category?: string;
    subcategory?: string;
    isFeatured?: boolean;
    status?: 'Active'| 'Inactive'| 'Pending'| 'Draft';
    search?:string;
}
export const productService = {
    getProducts: (params: getProductParams) => publicClient.get('/Product', {params}),
    createProduct: (data: createProduct) => publicClient.post('/Product', data),
    getProductById: (id: string) => publicClient.get(`/Product/${id}`),
    updateProduct: (id: string, data: createProduct) => publicClient.put(`/Product/${id}`, data),
    deleteProduct: (id: string) => publicClient.delete(`/Product/${id}`),
}