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
};
