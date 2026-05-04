import { z } from "zod";

export const updateProjectSchema = z.object({
    title: z.string().min(1, "Title is required"),
    status: z.enum(["pending", "approved"], {
        message: "Select a valid status",
    }),
    description: z.string().min(1, "Description is required"),
});

export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
