export interface Lecturer {
    id: string;
    name: string;
    email: string;
    staffNumber: string;
}

export interface Student {
    id: string;
    name: string;
    email: string;
    matricNumber: string;
    level: string;
}

export interface Session {
    id: string;
    name: string;
}

export interface Document {
    startedAt: string;
    googleDocId: string;
    googleDocUrl: string;
}

export interface ProjectTopic {
    id: string;
    title: string;
    description: string;
    document: Document | null;
    status: "pending" | "approved";
    approved_by: string | null;
    approved_at: string | null;
    createdAt: string;
    updatedAt: string;
    session: Session;
    student: Student;
}

export interface ProjectsResponse {
    lecturer: Lecturer;
    count: number;
    data: ProjectTopic[];
}
