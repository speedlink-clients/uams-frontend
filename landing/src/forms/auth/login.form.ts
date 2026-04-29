import { useForm } from "react-hook-form";
import type { LoginFormData } from "@schemas/auth/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import LoginSchema from "@schemas/auth/login.schema";

const useLoginForm = () => {
    return useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
}

export default useLoginForm;
