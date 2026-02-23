import axiosClient from "@configs/axios.config";
import type { ResultCourse, StudentResult } from "@type/result.type";

export const ResultService = {
    getResultCourses: async (params?: Record<string, string>): Promise<ResultCourse[]> => {
        const { data } = await axiosClient.get<ResultCourse[]>("/lecturer/results/courses", { params });
        return data;
    },

    getResults: async (courseId: string, tab: "lecturer" | "ero"): Promise<StudentResult[]> => {
        const { data } = await axiosClient.get<StudentResult[]>(`/lecturer/results/${courseId}`, {
            params: { tab },
        });
        return data;
    },
};
