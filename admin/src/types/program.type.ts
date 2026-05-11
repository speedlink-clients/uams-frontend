export type ProgramTypeCode = "UG" | "PGD" | "Masters" | "PhD";

export interface ProgramTypeResponse {
    id: string;
    name: string;
    type: string;
    code: string;
    description: string;
    isActive: boolean;
    universityId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Program {
    id: string;
    name: string;
    code: string | null;
    programTypeId: string | null;
    duration: number;
    description: string | null;
    universityId: string;
    departmentId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    programType: {
        id: string;
        name: string;
    } | null;
    type?: string;
}

export interface CreateProgramData {
    name: string;
    code: string;
    type: string;
    duration: number;
    description: string;
}
