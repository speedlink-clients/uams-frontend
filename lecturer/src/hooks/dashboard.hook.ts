import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { DashboardService } from "@services/dashboard.service";
import type { DashboardResponse, AttendanceDataPoint } from "@type/dashboard.type";

const MOCK_ATTENDANCE: AttendanceDataPoint[] = [
    { courseCode: "CMS 101", attendance: 45 },
    { courseCode: "CMS 102", attendance: 30 },
    { courseCode: "CMS 103", attendance: 52 },
    { courseCode: "CMS 104", attendance: 40 },
    { courseCode: "CMS 105", attendance: 68 },
];

export const DashboardHook = {
    useDashboardData: (options?: Partial<UseQueryOptions<DashboardResponse["data"]>>) =>
        useQuery<DashboardResponse["data"]>({
            queryKey: ["dashboard", "data"],
            queryFn: DashboardService.getDashboardData,
            staleTime: 5 * 60 * 1000,
            ...options,
        }),

    useAttendance: (
        _from: string,
        _to: string,
        options?: Partial<UseQueryOptions<AttendanceDataPoint[]>>
    ) =>
        useQuery<AttendanceDataPoint[]>({
            queryKey: ["dashboard", "attendance", _from, _to],
            queryFn: async () => MOCK_ATTENDANCE,
            staleTime: 5 * 60 * 1000,
            ...options,
        }),
};
