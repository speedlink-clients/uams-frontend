import axiosClient from "@configs/axios.config"
import type { LoginData, LoginResponse } from "@type/auth.type"
import { sleep } from "@utils/sleep.util";

export const AuthService = {
    login: async (payload: LoginData) => {
        const { data } = await axiosClient.post<LoginResponse>("/auth/login", payload);

        await sleep(3000);
        return data;
    },
    logout: async () => {

    }
}