import axiosClient from "@configs/axios.config";
import type { Attendance, CreateAttendancePayload, AttendanceResponse } from "@type/attendance.type";

export const AttendanceService = {
    createAttendance: async (payload: CreateAttendancePayload): Promise<{ success: boolean }> => {
        const { data } = await axiosClient.post<{ success: boolean }>("/attendance", payload);
        return data;
    },

    getLecturerAttendance: async (params?: { courseId?: string; date?: string }): Promise<Attendance[]> => {
        const { data } = await axiosClient.get<AttendanceResponse>("/attendance/lecturer", { params });
        return data.data;
    },
};
