// @stores/auth.store.ts
import type { AuthState } from "@type/auth.type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE4MGRjMmI0LWRiYWYtNDFkZi04OTkxLTY0NmU2MmQzNWEzOSIsInJvbGUiOiJTVEFGRiIsImlhdCI6MTc3ODUxMTY4NywiZXhwIjoxNzc5MTE2NDg3fQ.4BZJB2V1pNWEpBnXAk9XHr12Rb1LTlVVRuBXuS3cSOk",
            expireAt: "7d",
            user: {
                id: "a80dc2b4-dbaf-41df-8991-646e62d35a39",
                email: "frank@dummy.com",
                name: "Frank Amadi Dike",
                roles: [
                    "STAFF",
                    "LECTURER"
                ]
            },
            setAuth: (auth) => set((state) => ({ ...state, ...auth })),
            clearAuth: () => set({
                token: "",
                expireAt: "",
                user: undefined
            }),
        }),
        {
            name: "user-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                token: state.token,
                expireAt: state.expireAt,
                user: state.user,
            }),
        }
    )
);

export default useAuthStore;


/*{
   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE4MGRjMmI0LWRiYWYtNDFkZi04OTkxLTY0NmU2MmQzNWEzOSIsInJvbGUiOiJTVEFGRiIsImlhdCI6MTc3ODUxMTY4NywiZXhwIjoxNzc5MTE2NDg3fQ.4BZJB2V1pNWEpBnXAk9XHr12Rb1LTlVVRuBXuS3cSOk",
   "expireAt": "7d",
   "user": {
       "id": "a80dc2b4-dbaf-41df-8991-646e62d35a39",
       "email": "frank@dummy.com",
       "name": "Frank Amadi Dike",
       "roles": [
           "STAFF",
           "LECTURER"
       ]
   }
} */