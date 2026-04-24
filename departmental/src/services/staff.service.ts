import axiosClient from "@configs/axios.config"
import type { CreateLecturerPayload } from "@type/staff.type"
import type { AssignCoursePayload } from "@type/course.type"

export const StaffServices = {
    addLecturer: async (payload: CreateLecturerPayload) => {
        const { data } = await axiosClient.post("/university-admin/lecturers/", payload);
        return data;
    },

    updateLecturer: async (id: string, payload: Partial<CreateLecturerPayload>) => {
        const { data } = await axiosClient.put(`/university-admin/lecturers/${id}`, payload);
        return data;
    },

    assignCourses: async (lecturerId: string, payload: AssignCoursePayload) => {
        const { data } = await axiosClient.post(
            `/university-admin/lecturers/${lecturerId}/courses`,
            payload
        );
        return data;
    },

    
    assignStudent: async (lecturerId: string, payload: { studentId: string; level?: string }) => {
        const { data } = await axiosClient.post(
            `/university-admin/lecturers/${lecturerId}/students`,
            payload
        );
        return data;
    },

    getDepartmentLecturers: async () => {
        const { data } = await axiosClient.get("/university-admin/lecturers");
        return data;
    },

    deleteLecturer: async (id: string) => {
        const { data } = await axiosClient.delete(`/university-admin/lecturers/${id}`);
        return data;
    },

    bulkDownloadStaff: async (lecturerIds: string[]) => {
        const { data } = await axiosClient.post(
            "/university-admin/lecturers/bulk/download",
            { lecturerIds, format: "csv" },
            { responseType: "blob" }
        );
        return data;
    },

    bulkDeleteStaff: async (lecturerIds: string[]) => {
        const { data } = await axiosClient.post(
            "/university-admin/lecturers/bulk/delete",
            { lecturerIds }
        );
        return data;
    },

    bulkUploadLecturers: async (formData: FormData) => {
        const { data } = await axiosClient.post(
            "/university-admin/lecturers/bulk-upload",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return data;
    },
}