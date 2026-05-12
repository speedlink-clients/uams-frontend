export type CourseLevel = "L100" | "L200" | "L300" | "L400" | "L500" | "MSC" | "PHD";
export type Semester = "FIRST" | "SECOND";
export type CourseType = "CORE" | "ELECTIVE" | "REMEDIAL";

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  units: number;
  level: CourseLevel;
  semester: Semester;
  courseType: CourseType;
  programmeTypeId: string;
  isCarryoverAllowed: boolean;
  createdAt: string;
  updatedAt: string;
}

// API response wrapper
export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}