export interface Student {
    id: string;
    studentId: string;
    registrationNo: string;
    matricNumber: string;
    fullName?: string;
    name?: string; // from /project-supervisor/final-year-unassigned
    lastName?: string;
    otherNames?: string;
    email: string;
    phone?: string | null;
    gender?: string | null;
    dateOfBirth?: string | null;
    admissionMode?: string;
    entryYear?: string | null;
    entryQualification?: string;
    admissionDate?: string | null;
    sponsorship?: string | null;
    level?: string | { // can be just string from new endpoint
        id: string;
        name: string;
        code: string;
        duration: number;
    };
    programDuration?: number; // from new endpoint
    department: {
        id: string;
        name: string;
        code: string;
        faculty: {
            id: string;
            name: string;
            code: string;
        };
    };
    program: {
        id: string;
        name: string;
        code: string;
        duration: number;
    };
    courses: {
        id: string,
        code: string,
        title: string,
        registrationId: string,
        semesterId: string,
    };
    totalCourses: number;
    currentGPA: string;
    totalCreditsEarned: number;
    academicStanding: string;
}

export interface StudentFilters {
    level: string;
    page: number;
    limit: number;
    search?: string;
}
