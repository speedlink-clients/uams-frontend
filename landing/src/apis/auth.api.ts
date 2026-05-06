import axiosClient from "@configs/axios.config"
import type { 
    LoginData, 
    LoginResponse, 
    SignupFormData,
    SignupResponse,
    ActivateAccountRequest, 
    ActivateAccountResponse, 
    InitializePaymentResponse, 
    DepartmentDuesResponse, 
    VerifyStudentResponse,
} from "@type/auth.type"

/**
 * AUTH API
 * Standalone API methods for authentication and student account management.
 */

export const loginApi = async (payload: LoginData): Promise<LoginResponse> => {
    const { data } = await axiosClient.post<LoginResponse>("/auth/login", payload);
    return data;
}

export const signupApi = async (payload: SignupFormData): Promise<SignupResponse> => {
    const { data } = await axiosClient.post<SignupResponse>("/auth/signup", payload);
    return data;
}

export const logoutApi = async () => {
    // Optional: Implementation for logout if needed
}

export const verifyStudentApi = async (studentId: string): Promise<VerifyStudentResponse> => {
    const { data } = await axiosClient.post<VerifyStudentResponse>("/auth/verify-student", { matricNumber: studentId });
    return data;
}

export const activateAccountApi = async (payload: ActivateAccountRequest): Promise<ActivateAccountResponse> => {
    const { data } = await axiosClient.patch<ActivateAccountResponse>("/activate-student/update", payload);
    return data;
}

export const initializePaymentApi = async (callbackUrl?: string): Promise<InitializePaymentResponse> => {
    const url = callbackUrl || import.meta.env.VITE_CALLBACK_URL;
    const { data } = await axiosClient.post<InitializePaymentResponse>("/annual-access-fee/initialize", { callbackUrl: url });
    return data;
}

export const getDepartmentAnnualDueApi = async (): Promise<DepartmentDuesResponse> => {
    const { data } = await axiosClient.get<DepartmentDuesResponse>("/configs/payment-types/ANNUAL_ACCESS_FEE_AND_DEPARTMENTAL_DUES.");
    return data;
}

export const changePasswordApi = async (payload: any): Promise<any> => {
    const { data } = await axiosClient.patch("/user/update-password", payload);
    return data;
}

export const forgotPasswordApi = async (payload: { email: string }): Promise<{ status: string; message: string; data: null }> => {
    const { data } = await axiosClient.post("/auth/password", payload);
    return data;
}

export const verifyOtpApi = async (payload: { email: string; otp: string }): Promise<LoginResponse> => {
    const { data } = await axiosClient.post<LoginResponse>("/auth/verify", payload);
    return data;
}

export const resendOtpApi = async (payload: { email: string }): Promise<{ status: string; message: string; data: null }> => {
    const { data } = await axiosClient.post("/auth/password", payload);
    return data;
}

export const resetPasswordApi = async (payload: any): Promise<{ status: string; message: string; data: null }> => {
    const { data } = await axiosClient.patch("/auth/password", payload);
    return data;
}
