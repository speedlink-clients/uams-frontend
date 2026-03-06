export interface Course {
    id: string;
    universityId: string;
    departmentId: string;
    levelId: string;
    semesterId: string;
    code: string;
    title: string;
    creditUnits: number;
    learningHours: number;
    practicalHours: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    semester: {
        name: string;
        isActive: boolean;
    };
    level: {
        name: string;
    };
}

export interface CreateCourseData {
    universityId: string;
    departmentId: string;
    semesterId: string;
    code: string;
    title: string;
    creditUnits: number;
    learningHours: number;
    practicalHours: number;
    status: string;
    levelId?: string;
    programTypeId: string;
}

export interface CoursesApiResponse {
    status: string;
    count: number;
    courses: Course[];
    message?: string;
}

export interface CourseAssignment {
    courseId: string;
    role: "MAIN" | "ASSISTANT" | "LAB_ASSISTANT";
}

export interface AssignCoursePayload {
    courseAssignments: CourseAssignment[];
}
