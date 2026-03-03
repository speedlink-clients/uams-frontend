export interface ProjectTopic {
    id: string;
    title: string;
    description: string;
    document?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    updatedAt: string;
}

export interface CreateProjectTopicDto {
    title: string;
    description: string;
    document?: string;
}

export interface ProjectTopicResponse {
    success: boolean;
    data: ProjectTopic;
    message?: string;
}

export interface Supervisor {
    id: string;
    fullName: string;
    email: string;
    department: string;
    designation: string;
}

export interface MySupervisorResponse {
    success: boolean;
    data: Supervisor | null;
}
