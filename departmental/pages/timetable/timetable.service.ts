import api from "@/api/axios";
import type { TimetableItem, TimetableParams } from "./timetable.type";

export const TimetableService = {
    getTimetable: async (): Promise<TimetableItem[]> => {
        const { data } = await api.get<{ data: TimetableItem[] }>(`/timetables`)
        return data.data;
    },
    getTimetableParams: async (): Promise<TimetableParams> => {
        const { data } = await api.get<{ data: TimetableParams }>(`/timetables/params`)
        return data.data;
    },
    uploadTimetable: async (formData: FormData): Promise<void> => {
        await api.post(`/timetables`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
};
