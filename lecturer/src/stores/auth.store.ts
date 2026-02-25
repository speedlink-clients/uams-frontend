import type { AuthState } from "@type/auth.type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: "",
            expiresIn: "",
            setAuth: (token, expiresIn) => set({ token, expiresIn }),
            clearAuth: () => set({ token: "", expiresIn: "" }),
        }),
        {
            name: "auth-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                token: state.token,
                expiresIn: state.expiresIn,
            }),
        }
    )
);

export default useAuthStore;