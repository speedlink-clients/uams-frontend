import type { AuthState } from "@type/auth.type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const SESSION_KEY = "uniedu_session";

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: "",
            role: "",
            tenantId: "",
            universityId: "",
            facultyId: null,
            departmentId: null,
            email: undefined,
            username: undefined,
            user: null,
            isAuthenticated: false,

            setAuth: (auth) => {
                set({
                    ...auth,
                    isAuthenticated: !!auth.token,
                });

                // Also store in individual localStorage items for legacy support
                if (auth.token) localStorage.setItem("token", auth.token);
                if (auth.role) localStorage.setItem("userRole", auth.role);
                if (auth.tenantId) localStorage.setItem("tenantId", auth.tenantId);
                if (auth.universityId) localStorage.setItem("universityId", auth.universityId);
                if (auth.facultyId) localStorage.setItem("facultyId", auth.facultyId);
                if (auth.departmentId) localStorage.setItem("departmentId", auth.departmentId);
                if (auth.email) localStorage.setItem("userEmail", auth.email);
            },

            clearAuth: () => {
                // Clear all auth-related localStorage items
                localStorage.removeItem(SESSION_KEY);
                localStorage.removeItem("token");
                localStorage.removeItem("userRole");
                localStorage.removeItem("tenantId");
                localStorage.removeItem("universityId");
                localStorage.removeItem("facultyId");
                localStorage.removeItem("departmentId");
                localStorage.removeItem("userEmail");
                localStorage.removeItem("loginEmail");

                set({
                    token: "",
                    role: "",
                    tenantId: "",
                    universityId: "",
                    facultyId: null,
                    departmentId: null,
                    email: undefined,
                    username: undefined,
                    user: null,
                    isAuthenticated: false,
                });
            },
        }),
        {
            name: "auth-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                token: state.token,
                role: state.role,
                tenantId: state.tenantId,
                universityId: state.universityId,
                facultyId: state.facultyId,
                departmentId: state.departmentId,
                email: state.email,
                username: state.username,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useAuthStore;