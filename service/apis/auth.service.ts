import { privateClient, publicClient } from "../apiClient";
import { CreateUser, UserRole } from "@/types/User";

interface getUserParams {
    pageNumber : number,
    pageSize: number;
    role?: UserRole;
    status?: string;
    search?: string;
    sortBy?: string;
    isDescending?: boolean;
}
export const authService = {
    login: (data: { contactNumber: string, password: string }) => publicClient.post('/User/login', data),
    register: (data: CreateUser) => publicClient.post('/User/register', data),
    updateUser: (id: string, data: CreateUser) => privateClient.put(`/User/${id}`, data),
    deleteUser: (id: string) => privateClient.delete(`/User/${id}`),
    getUserById: (id: string) => privateClient.get(`/User/${id}`),
    getAllUser: (params:getUserParams ) => privateClient.get('/User', { params })
}