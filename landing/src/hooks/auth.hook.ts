import {
    loginApi,
    forgotPasswordApi,
    verifyStudentApi,
    activateAccountApi,
    initializePaymentApi,
    getDepartmentAnnualDueApi,
    changePasswordApi
} from "@services/auth.api"
import { useMutation, type UseMutationOptions, useQuery } from "@tanstack/react-query"
import type {
    LoginData,
    LoginResponse,
    ActivateAccountRequest,
    ActivateAccountResponse,
    InitializePaymentResponse,
    DepartmentDuesResponse,
} from "@type/auth.type"


// auth hooks

export const AuthHooks = {
    useLogin: (options?: UseMutationOptions<LoginResponse, Error, LoginData, unknown>) => useMutation<LoginResponse, Error, LoginData, unknown>({
        mutationFn: (payload: LoginData) => loginApi(payload),
        ...options
    }),

    useForgotPassword: (options?: UseMutationOptions<{ status: string; message: string; data: null }, Error, { email: string }, unknown>) => useMutation<{ status: string; message: string; data: null }, Error, { email: string }, unknown>({
        mutationFn: (payload: { email: string }) => forgotPasswordApi(payload),
        ...options
    }),

    useVerifyStudent: (options?: UseMutationOptions<LoginResponse, Error, string, unknown>) => useMutation<LoginResponse, Error, string, unknown>({
        mutationFn: (studentId: string) => verifyStudentApi(studentId),
        ...options
    }),

    useActivateAccount: (options?: UseMutationOptions<ActivateAccountResponse, Error, ActivateAccountRequest, unknown>) => useMutation<ActivateAccountResponse, Error, ActivateAccountRequest, unknown>({
        mutationFn: (payload: ActivateAccountRequest) => activateAccountApi(payload),
        ...options
    }),

    useInitializePayment: (options?: UseMutationOptions<InitializePaymentResponse, Error, string | undefined, unknown>) => useMutation<InitializePaymentResponse, Error, string | undefined, unknown>({
        mutationFn: (callbackUrl?: string) => initializePaymentApi(callbackUrl),
        ...options
    }),

    useDepartmentAnnualDue: () => useQuery<DepartmentDuesResponse, Error>({
        queryKey: ["department-annual-due"],
        queryFn: () => getDepartmentAnnualDueApi(),
    }),

    useChangePassword: (options?: UseMutationOptions<any, Error, any, unknown>) => useMutation<any, Error, any, unknown>({
        mutationFn: (payload: any) => changePasswordApi(payload),
        ...options
    }),
}
