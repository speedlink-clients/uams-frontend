import axiosClient from "@configs/axios.config"

export const StudentServices = {
    getStudents: async (page: number, limit: number) => {
        const { data } = await axiosClient.get("/university-admin/students", {
            params: { page, limit },
        });
        return data;
    },

    getDepartmentStudents: async () => {
        const { data } = await axiosClient.get("/students/department-students");
        return data;
    },

    getStudentProfile: async (studentId: string) => {
        const { data } = await axiosClient.get(`/students/profile/${studentId}`);
        return data;
    },

    bulkUploadStudents: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const { data } = await axiosClient.post(
            "/university-admin/students/bulk-upload",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return data;
    },

    bulkDownloadStudents: async (studentIds: string[]) => {
        const { data } = await axiosClient.post(
            "/university-admin/students/bulk-download",
            { studentIds, format: "csv" },
            { responseType: "blob" }
        );
        return data;
    },

    bulkDeleteStudents: async (studentIds: string[], reason: string) => {
        const { data } = await axiosClient.post(
            "/university-admin/students/bulk-delete",
            { studentIds, reason }
        );
        return data;
    },

    assignClassRepRole: async (userId: string, role: string) => {
        const { data } = await axiosClient.post("/class-rep/assign", { userId, role });
        return data;
    },

    updateStudent: async (studentId: string, data: any) => {
        const { data: response } = await axiosClient.patch(`/students/${studentId}`, data);
        return response;
    },
}
