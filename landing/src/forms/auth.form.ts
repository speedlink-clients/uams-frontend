import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
    LoginSchema, type LoginFormData,
    ActivateAccountSchema, type ActivateAccountFormData,
    ResetPasswordSchema, type ResetPasswordFormData,
    ForgotPasswordSchema, type ForgotPasswordFormData,
    OtpSchema, type OtpFormData,
    VerifyStudentSchema, type VerifyStudentFormData
} from "@schemas/auth.schema";


export const useLoginForm = () => {
    return useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
}



export const useActivateAccountForm = () => {
    return useForm<ActivateAccountFormData>({
        resolver: zodResolver(ActivateAccountSchema),
        defaultValues: {
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
        },
    });
}

export const useResetPasswordForm = () => {
    return useForm<ResetPasswordFormData>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });
};

export const useForgotPasswordForm = () => {
    return useForm<ForgotPasswordFormData>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });
};

export const useOtpForm = () => {
    return useForm<OtpFormData>({
        resolver: zodResolver(OtpSchema),
        defaultValues: {
            otp: "",
        },
    });
};

export const useVerifyStudentForm = () => {
    return useForm<VerifyStudentFormData>({
        resolver: zodResolver(VerifyStudentSchema),
        defaultValues: {
            matricNumber: "",
        },
    });
};
