import axiosClient from "@configs/axios.config";
import type { Lecturer } from "@type/lecturer.type";

export const LecturerService = {
    getLecturers: async (): Promise<Lecturer[]> => {
        const { data } = await axiosClient.get<{data:Lecturer[]}>(
            "/hod/lecturers"
        );
        return data.data;
    },
};
