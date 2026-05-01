import { User } from "@/types/User";
import { create } from "zustand";

interface AuthStore {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    setUser: (user: User, token: string) => void;
    removeUser: () => void;
    loadUser: () => void;
}

const STORAGE_KEY = 'auth';

export const useAuthStore = create<AuthStore>((set) => ({
    isAuthenticated: false,
    user: null,
    token: null,
    setUser: (user: User, token: string) => {
        try {
            const data = JSON.stringify({ user, token });

            localStorage.setItem(STORAGE_KEY, data);

            set({
                isAuthenticated: true,
                user,
                token
            })
        } catch (error) {
            console.error('Error while storing auth :', error);
        }
    },
    removeUser: () => {
        try {
            localStorage.removeItem(STORAGE_KEY);

            set({
                isAuthenticated: false,
                user: null,
                token: null,
            })
        } catch (error) {
            console.error('Error while removing auth : ', error);
        }
    },
    loadUser: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);

            if (data) {
                const authData = JSON.parse(data);

                set({
                    isAuthenticated: true,
                    user: authData?.user,
                    token: authData?.token
                })
            }
        } catch (error) {
            console.error('Error while loading user for restoring session : ', error);
        }
    }
}))