import axiosClient from "@configs/axios.config";
import type { TimetableItem } from "@type/timetable.type";

export const TimetableService = {
    getTimetable: async (): Promise<TimetableItem[]> => {
        const { data } = await axiosClient.get<{ data: TimetableItem[] }>(`/timetables`)
        return data.data;
    },

    // uploadTimetable: async (formData: FormData): Promise<void> => {
    //     await axiosClient.put(`/timetable`, formData, {
    //         headers: {
    //             "Content-Type": "multipart/form-data",
    //         },
    //     });
    // },
};
