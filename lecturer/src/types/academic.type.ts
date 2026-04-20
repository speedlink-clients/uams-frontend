export interface Session {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

export interface Semester {
    id: string;
    name: string;
    isActive: boolean;
}

export interface Level {
    id: string;
    name: string;
    code: string;
    duration: number;
}
