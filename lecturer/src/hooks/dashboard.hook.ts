import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type {
    DashboardStats,
    AttendanceDataPoint,
    TimetableEntry,
} from "@type/dashboard.type";

// ── Mock Data (remove when APIs are ready) ──────────────────────────

const MOCK_STATS: DashboardStats = {
    assignedCourses: 3,
    ongoingProjects: 4,
};

const MOCK_ATTENDANCE: AttendanceDataPoint[] = [
    { courseCode: "CMS 101", attendance: 45 },
    { courseCode: "CMS 102", attendance: 30 },
    { courseCode: "CMS 103", attendance: 52 },
    { courseCode: "CMS 104", attendance: 40 },
    { courseCode: "CMS 105", attendance: 68 },
];

const MOCK_TIMETABLE: TimetableEntry[] = [
    { id: "1", title: "Electronic Engineering", courseCode: "CSC 201.1", startTime: "10:00", endTime: "12:00pm", isActive: true },
    { id: "2", title: "Computer Science", courseCode: "CSC 200.1", startTime: "12:00", endTime: "1:30pm" },
    { id: "3", title: "General Studies", courseCode: "GES 200.1", startTime: "12:00", endTime: "1:30pm" },
    { id: "4", title: "Computer Science", courseCode: "CSC 200.1", startTime: "12:00", endTime: "1:30pm" },
    { id: "5", title: "Computer Science", courseCode: "CSC 200.1", startTime: "12:00", endTime: "1:30pm" },
    { id: "6", title: "General Studies", courseCode: "GES 200.1", startTime: "12:00", endTime: "1:30pm" },
    { id: "7", title: "Computer Science", courseCode: "CSC 200.1", startTime: "12:00", endTime: "1:30pm" },
    { id: "8", title: "Computer Science", courseCode: "CSC 200.1", startTime: "12:00", endTime: "1:30pm" },
    { id: "9", title: "General Studies", courseCode: "GES 200.1", startTime: "12:00", endTime: "1:30pm" },
    { id: "10", title: "Computer Science", courseCode: "CSC 200.1", startTime: "12:00", endTime: "1:30pm" },
];

// ── Hooks ────────────────────────────────────────────────────────────

export const DashboardHook = {
    useStats: (options?: Partial<UseQueryOptions<DashboardStats>>) =>
        useQuery<DashboardStats>({
            queryKey: ["dashboard", "stats"],
            // TODO: swap with DashboardService.getStats() when API is ready
            queryFn: async () => MOCK_STATS,
            staleTime: 5 * 60 * 1000,
            ...options,
        }),

    useAttendance: (
        from: string,
        to: string,
        options?: Partial<UseQueryOptions<AttendanceDataPoint[]>>
    ) =>
        useQuery<AttendanceDataPoint[]>({
            queryKey: ["dashboard", "attendance", from, to],
            // TODO: swap with DashboardService.getAttendance(from, to) when API is ready
            queryFn: async () => MOCK_ATTENDANCE,
            staleTime: 5 * 60 * 1000,
            ...options,
        }),

    useTimetable: (
        date: string,
        options?: Partial<UseQueryOptions<TimetableEntry[]>>
    ) =>
        useQuery<TimetableEntry[]>({
            queryKey: ["dashboard", "timetable", date],
            // TODO: swap with DashboardService.getTimetable(date) when API is ready
            queryFn: async () => MOCK_TIMETABLE,
            staleTime: 5 * 60 * 1000,
            ...options,
        }),
};
