import axiosClient from "@configs/axios.config";
import type { 
    LoginData, 
    LoginResponse, 
    ActivateAccountRequest, 
    ActivateAccountResponse, 
    InitializePaymentResponse, 
    DepartmentDuesResponse, 
} from "@type/auth.type";

/**
 * AUTH SERVICES
 * Provides methods for authentication and student account management.
 * Logic related to storage (localStorage) and navigation is handled by hooks and stores.
 * Global error handling is managed via axios interceptors.
 */
export const AuthServices = {
    /**
     * Standard login with email and password
     */
    login: async (payload: LoginData): Promise<LoginResponse> => {
        const { data } = await axiosClient.post<LoginResponse>("/auth/login", payload);
        return data;
    },

    /**
     * Verify student by matriculation number (pre-activation)
     */
    verifyStudent: async (studentId: string): Promise<LoginResponse> => {
        const { data } = await axiosClient.post<LoginResponse>("/activate-student/login", { studentId });
        return data;
    },

    /**
     * Activate student account with email and password
     */
    activateAccount: async (payload: ActivateAccountRequest): Promise<ActivateAccountResponse> => {
        const { data } = await axiosClient.patch<ActivateAccountResponse>("/activate-student/update", payload);
        return data;
    },

    /**
     * Initialize payment for annual access fee
     */
    initializePayment: async (callbackUrl?: string): Promise<InitializePaymentResponse> => {
        const url = callbackUrl || import.meta.env.VITE_CALLBACK_URL;
        const { data } = await axiosClient.post<InitializePaymentResponse>("/annual-access-fee/initialize", { callbackUrl: url });
        return data;
    },

    /**
     * Get department annual dues breakdown
     */
    getDepartmentAnnualDue: async (): Promise<DepartmentDuesResponse> => {
        const { data } = await axiosClient.get<DepartmentDuesResponse>("/configs/payment-types/ANNUAL_ACCESS_FEE_AND_DEPARTMENTAL_DUES.");
        return data;
    },

    /**
     * Change user password
     */
    changePassword: async (payload: any): Promise<any> => {
        const { data } = await axiosClient.patch("/user/update-password", payload);
        return data;
    },

    /**
     * Request a password reset link
     */
    forgotPassword: async (payload: { email: string }): Promise<{ status: string; message: string; data: null }> => {
        const { data } = await axiosClient.post("/auth/password", payload);
        return data;
    },
}

export default AuthServices;
