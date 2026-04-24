export interface Staff {
    id: string;
    staffId: string;
    name: string;
    email: string;
    role: string;
    activeFeatures: {
        results: boolean;
        finance: boolean;
        timetable: boolean;
    };
}

export interface CreateLecturerPayload {
    staffId: string;
    title: string;
    firstname: string;
    othername: string;
    sex: string;
    highestDegree: string;
    phoneNumber: string;
    email: string;
    role: string;
    category: string;
    password?: string;
    departmentId: string;
    universityId?: string;
}
