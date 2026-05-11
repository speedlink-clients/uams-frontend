export interface Level {
    id: string;
    name: string;
    code: string;
    programId: string;
    universityId: string;
    duration: number;
    program: {
        id: string;
        name: string;
        code: string;
    };
}

export interface Semester {
    id: string;
    name: string;
    isActive: boolean;
}

export interface Session {
    id: string;
    name: string;
    status?: 'Current' | 'Past' | 'Upcoming';
    isActive?: boolean;
}
