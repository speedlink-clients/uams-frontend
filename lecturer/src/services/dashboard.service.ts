import axiosClient from "@configs/axios.config";
import type {
    DashboardStats,
    AttendanceDataPoint,
    TimetableEntry,
} from "@type/dashboard.type";

export const DashboardService = {
    getStats: async (): Promise<DashboardStats> => {
        const { data } = await axiosClient.get<DashboardStats>("/lecturer/dashboard/stats");
        return data;
    },

    getAttendance: async (from: string, to: string): Promise<AttendanceDataPoint[]> => {
        const { data } = await axiosClient.get<AttendanceDataPoint[]>("/lecturer/dashboard/attendance", {
            params: { from, to },
        });
        return data;
    },

    getTimetable: async (date: string): Promise<TimetableEntry[]> => {
        const { data } = await axiosClient.get<TimetableEntry[]>("/lecturer/dashboard/timetable", {
            params: { date },
        });
        return data;
    },
};
