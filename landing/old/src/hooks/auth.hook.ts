import { AuthServices } from "@services/auth.service"
import { useMutation, type UseMutationOptions } from "@tanstack/react-query"
import type { LoginData, LoginResponse } from "@type/auth.type"


// auth hook
export const AuthHooks = {
    useLogin: (options?: UseMutationOptions<LoginResponse, Error, LoginData, unknown>) => useMutation<LoginResponse, Error, LoginData, unknown>({
        mutationFn: (payload: LoginData) => AuthServices.login(payload),
        ...options
    }),

    useForgotPassword: (options?: UseMutationOptions<{ status: string; message: string; data: null }, Error, { email: string }, unknown>) => useMutation<{ status: string; message: string; data: null }, Error, { email: string }, unknown>({
        mutationFn: (payload: { email: string }) => AuthServices.forgotPassword(payload),
        ...options
    }),
}