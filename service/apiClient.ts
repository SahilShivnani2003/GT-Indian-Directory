import { useAuthStore } from "@/store/useAuthStore";
import { ApiError } from "@/types/ApiError";
import axios from "axios";

const BASE_URL = process.env.API_URL || 'https://indian-online-directory-be.onrender.com/api';

export const publicClient = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 50000
});

publicClient.interceptors.response.use(
    response => response,
    error => {
        const apiError: ApiError = {
            status: error?.response?.status,
            message: error?.response?.data?.message || error.message || 'An unexpected error occurred',
            response: error?.response?.data
        };
        return Promise.reject(apiError);
    }
);

export const privateClient = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000
});

// ✅ Fixed: getState() instead of hook, and attached to privateClient
privateClient.interceptors.request.use(
    config => {
        const token = useAuthStore.getState().token; 
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

privateClient.interceptors.response.use(
    response => response,
    error => {
        const apiError: ApiError = {
            status: error?.response?.status,
            message: error?.response?.data?.message || error.message || 'An unexpected error occurred',
            response: error?.response?.data
        };
        return Promise.reject(apiError);
    }
);