import axiosClient from "@configs/axios.config";
import type { Student, StudentFilters } from "@type/student.type";

export const StudentService = {
    getStudents: async (filters?: StudentFilters): Promise<Student[]> => {
        const { data } = await axiosClient.get<{
            data: {
                students: Student[]
            }
        }>("/hod/students", {
            params: filters,
        });
        return data.data.students;
    },

    getUnassignedStudents: async (): Promise<Student[]> => {
        const { data } = await axiosClient.get<{
            count: number;
            data: Student[];
        }>("/project-supervisor/final-year-unassigned");
        return data.data;
    },

    getAssignedStudents: async (lecturerId: string): Promise<Student[]> => {
        const { data } = await axiosClient.get<{
            success: boolean;
            data: {
                students: Student[];
                total: number;
            }
        }>(`/hod/lecturers/${lecturerId}/assigned-students`);
        return data.data.students;
    },

    assignStudents: async (payload: {
        lecturerId: string;
        sessionId: string;
        studentIds: string[];
        notes: string;
    }): Promise<any> => {
        const { data } = await axiosClient.post("/project-supervisor/assign", payload);
        return data;
    },

    removeAssignedStudent: async (
        lecturerId: string, 
        studentId: string, 
        sessionId: string
    ): Promise<any> => {
        const { data } = await axiosClient.delete(
            `/hod/lecturers/${lecturerId}/assigned-students/${studentId}`,
            { data: { sessionId } }
        );
        return data;
    }
};