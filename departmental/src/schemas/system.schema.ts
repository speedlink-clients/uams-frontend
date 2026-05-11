import { z } from "zod";

export const systemSettingsSchema = z.object({
  currentSession: z.string().min(1, "Current session is required"),
  semester1StartDate: z.any().optional(),
  semester1EndDate: z.any().optional(),
  semester2StartDate: z.any().optional(),
  semester2EndDate: z.any().optional(),
  semester3StartDate: z.any().optional(),
  semester3EndDate: z.any().optional(),
  
  caPercentage: z.number().min(0).max(100),
  examPercentage: z.number().min(0).max(100),
  
  probationCgpaThreshold: z.number().min(0).max(5.0),
  suspensionThreshold: z.number().min(1),
  
  siwesRequired: z.boolean(),
  siwesMinimumWeeks: z.number().min(1),
  siwesLevel: z.string().min(1),
});

export type SystemSettingsData = z.infer<typeof systemSettingsSchema>;
