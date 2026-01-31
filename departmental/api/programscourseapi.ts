import api from "./axios";
import { getCurrentDepartmentId, getCurrentUniversityId } from "../utils/auth";
import {
  Program,
  Course,
  CreateCourseData,
  CoursesApiResponse,
  CreateProgramData,
  ProgramTypeResponse,
} from "./types";

export const programsCoursesApi = {
  /** PROGRAMS **/
  
  // ✅ New Endpoint: Get Program Types 
  getProgramTypes: async (): Promise<ProgramTypeResponse[]> => {
    // This endpoint seems to be public or just authenticated; no specific param needed per user request
    const response = await api.get<ProgramTypeResponse[]>("/program-types");
    return response.data;
  },

  createProgramType: async (data: any): Promise<ProgramTypeResponse> => {
    const response = await api.post<ProgramTypeResponse>("/program-types", data);
    return response.data;
  },

  deleteProgramType: async (id: string): Promise<void> => {
    await api.delete("/program-types/delete", { data: { ids: [id] } });
  },

  updateProgramType: async (id: string, data: any): Promise<ProgramTypeResponse> => {
    const response = await api.put<ProgramTypeResponse>(`/program-types/${id}`, data);
    return response.data;
  },

  bulkDeleteProgramTypes: async (ids: string[]): Promise<void> => {
    await api.delete("/program-types/delete", { data: { ids } });
  },

  getProgramsByDepartment: async (): Promise<Program[]> => {
    const departmentId = getCurrentDepartmentId();
    if (!departmentId) {
      throw new Error("No department ID found in token");
    }

    const response = await api.get<{ success: boolean; count: number; data: Program[] }>(
      `/program/department/${departmentId}`
    );
    return response.data.data;
  },

  createProgram: async (formData: CreateProgramData): Promise<Program> => {
    // 🔐 Ensure user is authenticated
    const departmentId = getCurrentDepartmentId();
    const universityId = getCurrentUniversityId();

    if (!departmentId || !universityId) {
      throw new Error("Missing required IDs from authentication token");
    }

    // ❗ Payload MUST match Postman (IDs come from JWT, not body)
    const payload = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      programTypeId: formData.type, // Map the selected ID to programTypeId
      duration: Number(formData.duration),
      description: formData.description?.trim() || "",
    };

    console.log("🚀 Payload sent to Program Service:");

    const response = await api.post<Program>(`/program`, payload);
    return response.data;
  },

  /** COURSES **/
  /** GET COURSES FOR LOGGED-IN DEPARTMENT */
  getCoursesByDepartment: async (): Promise<CoursesApiResponse> => {
    const departmentId = getCurrentDepartmentId();
    if (!departmentId) {
      throw new Error("No department ID found in token");
    }

    const response = await api.get<CoursesApiResponse>(
      "/courses/my-department"
    );

    return response.data;
  },

  /** CREATE COURSE */
  createCourse: async (courseData: CreateCourseData): Promise<Course> => {
    const payload = {
      ...courseData,
      programTypeId: courseData.programTypeId, // ✅ Added programTypeId
      universityId: getCurrentUniversityId(),
      departmentId: getCurrentDepartmentId(),
    };

    const response = await api.post<Course>("/courses", payload);
    return response.data;
  },

  deleteCourse: async (courseId: string): Promise<void> => {
    await api.delete(`/courses/${courseId}`);
  },

  /** UPDATE COURSE */
  updateCourse: async (courseId: string, courseData: any): Promise<Course> => {
      const response = await api.put<Course>(`/courses/${courseId}`, courseData);
      return response.data;
  },
  updateCourseStatus: async (courseId: string, courseData: any): Promise<Course> => {
      const response = await api.put<Course>(`/courses/${courseId}`, { isActive: courseData.isActive });
      return response.data;
  },

  /** UPDATE PROGRAM */
  updateProgram: async (programId: string, programData: any): Promise<Program> => {
      const payload = {
          name: programData.name,
          code: programData.code,
          description: programData.description,
          duration: Number(programData.duration),
          programTypeId: programData.type
      };
      
      const response = await api.patch<Program>(`/program/${programId}`, payload);
      return response.data;
  },
  updateProgramStatus: async (programId: string, programData: any): Promise<Program> => {
      const payload = {
          isActive: programData.isActive
      };
      
      const response = await api.patch<Program>(`/program/${programId}`, payload);
      return response.data;
  },
  deleteProgram: async (programId: string): Promise<void> => {
    await api.delete(`/program/${programId}`);
  },
};
