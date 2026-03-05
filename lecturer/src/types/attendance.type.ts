export interface Attendance {
    id: string;
    date: string;
    matricNo: string;
    fullName: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAttendancePayload {
    courseId: string;
    date: string;
    studentIds: string[];
}

export interface AttendanceResponse {
    success: boolean;
    count: number;
    data: Attendance[];
}
