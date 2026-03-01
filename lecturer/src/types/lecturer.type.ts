export interface Lecturer {
    id: string;
    tenantId: string | null;
    departmentId: string;
    userId: string;
    staffNumber: string;
    gender: string | null;
    isActive: boolean;
    specialization: string;
    maxSupervisionLoad: number;
    academicRank: string;
    additionalRoles: string[];
    currentAdminRole: string;
    bio: string;
    qualifications: string;
    contactEmail: string;
    officeLocation: string;
    expertiseAreas: string[];
    profileVisibility: "STUDENTS" | "STAFF" | "PUBLIC";
    createdAt: string;
    updatedAt: string;
    universityId: string;
    courseCount: number;
    User: {
        fullName: string;
        email: string;
        phone: string;
    };
    courseAssignments: Array<{
        id: string;
        role: "MAIN" | "ASSISTANT";
        course: {
            id: string;
            code: string;
            title: string;
        };
    }>;
    courses: Array<{
        id: string;
        code: string;
        title: string;
        role: "MAIN" | "ASSISTANT";
    }>;
}
