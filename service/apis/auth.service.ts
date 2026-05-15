import { privateClient, publicClient } from "../apiClient";
import { CreateUser, UserRole } from "@/types/User";

export const authService = {
    login: (data: {contactNumber:string, password: string}) => publicClient.post('/User/login', data),
    register: (data:CreateUser) => publicClient.post('/User', data),
    updateUser: (id:string, data:CreateUser) =>privateClient.put(`/User/${id}`, data),
    getUserbyEmail: (emailId: string) => privateClient.get(`/User/email/${emailId}`),
    getUsersByRole: (role: UserRole) => privateClient.get(`/User/role/${role}`),
    deleteUser: (id: string) => privateClient.delete(`/User/${id}`),
    getUserById: (id: string) => privateClient.get(`/User/${id}`)
}