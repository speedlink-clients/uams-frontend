import axiosClient from "@configs/axios.config";
import type { Lecturer } from "@type/lecturer.type";

export const LecturerService = {
    getLecturers: async (search?: string): Promise<Lecturer[]> => {
        const { data } = await axiosClient.get<Lecturer[]>("/lecturer/lecturers", {
            params: search ? { search } : undefined,
        });
        return data;
    },
};
