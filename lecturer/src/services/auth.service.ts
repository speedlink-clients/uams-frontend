import { axiosClient } from "@configs/axios.config"
import type { LoginData, LoginResponse } from "@type/auth.type"

export const AuthService = {
    login: async (payload: LoginData) => {
        const { data } = await axiosClient.post<LoginResponse>("/auth/signin", payload);
        return data;
    },
    logout: async () => {
        // Clear client-side state (handled by stores)
    }
}