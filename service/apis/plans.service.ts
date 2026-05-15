import { CreatePlan } from "@/types/Plan";
import { privateClient } from "../apiClient";

export const planService = {
    createPlan: (data: CreatePlan) => privateClient.post('/Plans', data),
    getPlans: () => privateClient.get('/Plans'),
    getPlanById: (id: string) => privateClient.get(`/Plans/${id}`),
    updatePlan: (id: string, data: CreatePlan) => privateClient.put(`/Plans/${id}`, data),
    deletePlan: (id: string) => privateClient.delete(`/Plans/${id}`),
    getActivePlans: () => privateClient.get('/Plans/active')
}