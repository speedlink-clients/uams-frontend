import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { AuthService } from "@services/auth.service";
import type { LoginData, LoginResponse } from "@type/auth.type";

export const AuthHook = {
    useLogin: (options?: Partial<UseMutationOptions<LoginResponse, Error, LoginData>>) =>
        useMutation<LoginResponse, Error, LoginData>({
            mutationFn: (payload) => AuthService.login(payload),
            ...options,
        }),
};
