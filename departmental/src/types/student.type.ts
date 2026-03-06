export type StudentRole = 'Class Rep' | 'Dept Rep' | 'None' | 'Bachelors' | 'PGD' | 'Masters';

export interface Student {
    id: string;
    regNo: string;
    matNo: string;
    surname: string;
    otherNames: string;
    name: string;
    email: string;
    phoneNo: string;
    department: string;
    level: string;
    programId: string;
    role: StudentRole;
    sex: string;
    admissionMode: string;
    entryQualification: string;
    faculty: string;
    degreeCourse: string;
    programDuration: string;
    degreeAwardCode: string;
    permissions?: string[];
    createdAt: string;
    isActive: boolean;
    classRepRole?: 'CLASS_REP' | 'ASSISTANT_CLASS_REP';
}

export interface StudentProfile {
    id: string;
    universityId: string;
    departmentId: string;
    programId: string;
    userId: string;
    studentId: string;
    level: string;
    levelId: string;
    sessionId: string;
    isActive: boolean;
    academicStanding: string;
    probationStartDate: string | null;
    probationEndDate: string | null;
    totalCreditsEarned: number;
    currentGPA: string;
    createdAt: string;
    updatedAt: string;
    idCard: string | null;
    Department: {
        name: string;
        code: string;
        type: string;
        description: string | null;
    };
    Level: {
        id: string;
        name: string;
    };
    Program: {
        id: string;
        name: string;
        programTypeId: string;
        programType: {
            id: string;
            name: string;
            type: string;
            code: string;
        };
    };
    user: {
        fullName: string;
        email: string;
        phone: string;
        avatar: string | null;
        Roles: Array<{
            name: string;
            description: string;
        }>;
    };
    session: {
        id: string;
        name: string;
        isActive: boolean;
    };
    activeSemester: Array<{
        id: string;
        name: string;
        startDate: string;
        endDate: string;
    }>;
}

export interface StudentInfo {
    studentId: string;
    registrationNo: string | null;
    fullName: string;
    email: string;
}
