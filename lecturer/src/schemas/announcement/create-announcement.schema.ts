import { z } from "zod";

export const createAnnouncementSchema = z.object({
    title: z.string().min(1, "Title is required"),
    recipients: z.array(z.string()).min(1, "Select at least one recipient"),
    description: z.string().min(1, "Description is required"),
});

export type CreateAnnouncementSchema = z.infer<typeof createAnnouncementSchema>;
