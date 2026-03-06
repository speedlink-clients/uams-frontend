import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserState {
    name: string;
    email: string;
}

interface UserActions {
    setUser: (user: Partial<UserState>) => void;
    clearUser: () => void;
}

type UserStoreType = UserState & UserActions;

const useUserStore = create<UserStoreType>()(
    persist(
        (set) => ({
            name: "",
            email: "",
            setUser: (user) => set(user),
            clearUser: () => set({ name: "", email: "" }),
        }),
        {
            name: "user-profile-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                name: state.name,
                email: state.email,
            }),
        }
    )
);

export default useUserStore;