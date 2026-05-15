"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export function StoreHydration() {
  useEffect(() => {
    // Runs only on the client after mount — safe to access localStorage
    useAuthStore.persist.rehydrate();
  }, []);

  return null;
}
