export interface Course {
    id: string;
    universityId: string;
    departmentId: string;
    levelId: string;
    semesterId: string;
    code: string;
    title: string;
    description?: string;
    creditUnits: number;
    status: string;
    learningHours: number;
    practicalHours: number;
    createdAt: string;
    updatedAt: string;
    enrollmentCount: string;
    semester: {
        id: string;
        name: string;
        startDate: string;
        endDate: string;
    };
    level: {
        id: string;
        name: string;
        code: string;
    };
    lecturers: Array<{
        id: string;
        name: string;
        email: string;
    }>;
}

export interface CourseLecturer {
    id: string;
    name: string;
    avatarUrl?: string;
}

export interface CourseStudent {
    registrationId: string;
    enrollmentDate: string;
    id: string;
    studentId: string;
    registrationNo: string;
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string | null;
    dateOfBirth: string | null;
    level: string;
    levelId: string;
    levelCode: string;
    program: string;
    programId: string;
    programCode: string;
    department: string;
    departmentId: string;
    departmentCode: string;
    currentGPA: string;
    totalCreditsEarned: number;
    academicStanding: string;
    admissionMode: string;
    entryYear: string | null;
    entryQualification: string;
    admissionDate: string | null;
    sponsorship: string | null;
}

export interface CourseFilters {
    search: string;
    programType: string;
    level: string;
    semester: string;
}
