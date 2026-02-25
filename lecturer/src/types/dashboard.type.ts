export interface DashboardSummary {
    totalCourses: number;
    totalProjects: number;
    totalStudents: number;
    pendingReviews: number;
}

export interface TimetableSlot {
    id: string;
    courseCode: string;
    courseTitle: string;
    startTime: string; // e.g., "10:00"
    endTime: string;   // e.g., "12:00"
    venue?: string;
    day: string;       // e.g., "Monday"
}

export interface TimetableData {
    byDay: Record<string, TimetableSlot[]>;
    conflicts: any[];
    totalSlots: number;
}

export interface TimetableEntry {
    id: string;
    courseCode: string;
    courseTitle: string;
    title: string;
    startTime: string; // e.g., "10:00"
    endTime: string;   // e.g., "12:00"
    venue?: string;
    day: string;       // e.g., "Monday"
    isActive: boolean;
}

export interface DashboardResponse {
    success: boolean;
    data: {
        summary: DashboardSummary;
        assignedCourses: any[];
        ongoingProjects: any[];
        timetable: TimetableData;
    };
}

// Attendance Chart (kept for reference if still needed elsewhere, or if we want to fetch it separately)
export interface AttendanceDataPoint {
    courseCode: string;
    attendance: number;
}
