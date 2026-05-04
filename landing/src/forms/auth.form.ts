import { useForm } from "react-hook-form";
import { LoginSchema, type LoginFormData } from "@schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";


export const useLoginForm = () => {
    return useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
}
