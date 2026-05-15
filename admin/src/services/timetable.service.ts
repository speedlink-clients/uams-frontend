import axiosClient from "@configs/axios.config";
import type { TimetableItem, TimetableParams } from "@type/timetable.type";

export const TimetableService = {
    getTimetable: async (): Promise<TimetableItem[]> => {
        const { data } = await axiosClient.get<{ data: TimetableItem[] }>(`/timetables`);
        return data.data || data;
    },
    getTimetableParams: async (): Promise<TimetableParams> => {
        const { data } = await axiosClient.get<{ data: TimetableParams }>(`/timetables/params`);
        return data.data || data;
    },

    // The timetable template file is a static file built into the frontend's public/documents folder, not a backend API endpoint.
    downloadTimetableTemplate: async (): Promise<Blob> => {
        const response = await fetch(`/admin/documents/timetable-template.xlsx`);
        if (!response.ok) throw new Error("File not found");
        return response.blob();
    },
    uploadTimetable: async (formData: FormData): Promise<void> => {
        await axiosClient.post(`/timetables`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
};
