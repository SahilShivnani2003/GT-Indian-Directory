import { CreateSubscription } from "@/types/Subscription";
import { privateClient } from "../apiClient";

export const subscriptionService = {
    createSubscription: (data: CreateSubscription) => privateClient.post('/Subscription', data),
    getListtingSubscriptions: (listingId: string) => privateClient.get(`/Subscription/listing/${listingId}/active`),
    getExpiredSubscriptions: () => privateClient.get('/Subscription/expired'),
    renewSubscription: (id: string, data: { newEndDate: string }) => privateClient.patch(`/Subscription/${id}/renew`, data),
    deactivateSubscription: (id: string) => privateClient.patch(`/Subscription/${id}/deactivate`),
}