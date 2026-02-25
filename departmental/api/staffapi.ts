import api from "./axios";
import { AssignCoursePayload } from "./types";

export interface CreateLecturerPayload {
  staffId: string;
  title: string;
  firstname: string;
  othername: string;
  sex: string;
  highestDegree: string;
  phoneNumber: string;
  email: string;
  role: string;
  category: string;
  password?: string;
  departmentId?: string; // Optional if handled by backend/jwt
  universityId?: string; // Optional if handled by backend/jwt
}

export const staffApi = {
  addLecturer: async (payload: CreateLecturerPayload) => {
    const response = await api.post("/university-admin/lecturers", payload);
    return response.data;
  },

  updateLecturer: async (id: string, payload: Partial<CreateLecturerPayload>) => {
    const response = await api.put(`/university-admin/lecturers/${id}`, payload);
    return response.data;
  },

  assignCourses: async (lecturerId: string, payload: AssignCoursePayload) => {
    const response = await api.post(
      `/university-admin/lecturers/${lecturerId}/courses`,
      payload
    );
    return response.data;
  },

  bulkDownloadStaff: async (lecturerIds: string[]) => {
    const response = await api.post(
      "/university-admin/lecturers/bulk/download",
      {
        lecturerIds: lecturerIds,
        format: "csv",
      },
      {
        responseType: "blob", // Important for file download
      }
    );
    return response.data;
  },

  bulkDeleteStaff: async (lecturerIds: string[]) => {
    const response = await api.post(
      "/university-admin/lecturers/bulk/delete",
      {
        lecturerIds: lecturerIds,
      }
    );
    return response.data;
  },

  bulkUploadLecturers: async (formData: FormData) => {
    const response = await api.post(
      "/university-admin/lecturers/bulk-upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  getDepartmentLecturers: async () => {
     const response = await api.get("/university-admin/lecturers");
     return response.data;
  }
};
