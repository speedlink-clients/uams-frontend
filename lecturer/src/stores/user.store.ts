import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserState, UserActions } from "@type/user.type";

type UserStoreType = UserState & UserActions;

const useUserStore = create<UserStoreType>()(
    persist(
        (set) => ({
            user: null,
            permissions: null,
            setUser: (user, permissions) => set({ user, permissions }),
            clearUser: () => set({ user: null, permissions: null }),
        }),
        {
            name: "lecturer-user-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                permissions: state.permissions,
            }),
        }
    )
);

export default useUserStore;