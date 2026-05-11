import { z } from "zod";

export const systemSettingsSchema = z.object({
  currentSession: z.string().min(1, "Current session is required"),
  semester1StartDate: z.any().optional(),
  semester1EndDate: z.any().optional(),
  caPercentage: z.number().min(0).max(100),
  examPercentage: z.number().min(0).max(100),
});

export type SystemSettingsData = z.infer<typeof systemSettingsSchema>;
