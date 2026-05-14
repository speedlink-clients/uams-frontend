import { z } from "zod";

export const StudentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  surname: z.string().min(1, "Surname is required"),
  otherName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  gender: z.string().min(1, "Gender is required"),
  matricNumber: z.string().min(1, "Matric number is required"),
  registrationNo: z.string().optional(),
  level: z.string().min(1, "Level is required"),
  admissionMode: z.string().min(1, "Admission mode is required"),
  admissionYear: z.coerce.number().min(1900, "Invalid year").optional(),
  admissionSession: z.string().optional(),
  entryQualification: z.string().min(1, "Entry qualification is required"),
  degreeAwardedCode: z.string().min(1, "Degree code is required"),
  degreeCourse: z.string().min(1, "Degree course is required"),
  degreeDuration: z.string().min(1, "Degree duration is required"),
  faculty: z.string().min(1, "Faculty is required"),
  department: z.string().min(1, "Department is required"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export type StudentFormData = z.infer<typeof StudentSchema>;
