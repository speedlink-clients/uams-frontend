import axiosClient from "@configs/axios.config";
import type { TimetableEntry, TimetableResponse } from "@type/timetable.type";

export const TimetableService = {
  // Fetch all timetables (optionally filter by session/semester)
  getTimetable: async (params?: { session?: string; semester?: string }): Promise<TimetableEntry[]> => {
    const { data } = await axiosClient.get<TimetableResponse>("/timetables", { params });
    return data.data;
  },
};