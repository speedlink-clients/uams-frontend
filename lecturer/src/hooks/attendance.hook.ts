import { AttendanceService } from "@services/attendance.service";
import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import type { Attendance, CreateAttendancePayload } from "@type/attendance.type";

export const AttendanceHook = {
    useLecturerAttendance: (
        params?: { courseId?: string; date?: string },
        options?: Partial<UseQueryOptions<Attendance[]>>
    ) =>
        useQuery<Attendance[]>({
            queryKey: ["lecturerAttendance", params],
            queryFn: async () => AttendanceService.getLecturerAttendance(params),
            ...options,
        }),

    useCreateAttendance: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (payload: CreateAttendancePayload) => AttendanceHook.createAttendance(payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["lecturerAttendance"] });
            },
        });
    },

    createAttendance: async (payload: CreateAttendancePayload) => {
        return AttendanceService.createAttendance(payload);
    }
};
