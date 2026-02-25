// ── Login ──
export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    token: string;
    expiresIn: string;
    user: AuthUser;
    permissions: AuthPermissions;
}

export interface AuthUser {
    id: string;
    firstName: string;
    lastName: string;
    middleNames: string;
    fullName: string;
    email: string;
    phone: string;
    avatar: string | null;
    role: string;
    gender: string | null;
    isActive: boolean;
    universityId: string;
    tenantId: string | null;
    createdAt: string;
    profile: LecturerProfile;
    university: University;
    department: string | null;
}

export interface LecturerProfile {
    type: string;
    lecturerId: string;
    staffNumber: string;
    departmentId: string;
    departmentName: string;
    departmentCode: string;
    facultyId: string;
    facultyName: string;
    facultyCode: string;
    specialization: string;
    academicRank: string;
    additionalRoles: string[];
    profileVisibility: string;
    isActive: boolean;
}

export interface University {
    id: string;
    name: string;
    code: string;
    email: string;
    phone: string | null;
    address: string | null;
}

export interface AuthPermissions {
    facultyId: string | null;
    departmentId: string;
    universityId: string;
    tenantId: string | null;
}

// ── Auth Store State ──
export interface AuthState {
    token: string;
    expiresIn: string;
    setAuth: (token: string, expiresIn: string) => void;
    clearAuth: () => void;
}
