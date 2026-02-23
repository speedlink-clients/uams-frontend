export interface Course {
    id: string;
    code: string;
    title: string;
    description: string;
    creditUnit: number;
    programType: string;
    level: string;
    semester: string;
}

export interface CourseLecturer {
    id: string;
    name: string;
    avatarUrl?: string;
}

export interface CourseStudent {
    id: string;
    regNo: string;
    matNo: string;
    surname: string;
    otherNames: string;
    email: string;
    phoneNo: string;
    sex: string;
    admissionMode: string;
    entryQualification: string;
    department: string;
    faculty: string;
    degreeCourse: string;
    programDuration: string;
    degreeAwarded: string;
    attendancePresent: number;
    attendanceAbsent: number;
}

export interface CourseFilters {
    search: string;
    programType: string;
    level: string;
    semester: string;
}
