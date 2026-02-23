// Dashboard Stats
export interface DashboardStats {
    assignedCourses: number;
    ongoingProjects: number;
}

// Attendance Chart
export interface AttendanceDataPoint {
    courseCode: string;
    attendance: number;
}

// Timetable
export interface TimetableEntry {
    id: string;
    title: string;
    courseCode: string;
    startTime: string;
    endTime: string;
    isActive?: boolean;
}
