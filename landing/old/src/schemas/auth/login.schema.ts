import { z } from "zod";

const LoginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof LoginSchema>;
export default LoginSchema;
export type { LoginFormData };
