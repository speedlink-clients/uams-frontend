
// ── User profile from login response ────────────────────────────────

export interface UserProfile {
    type: string;
    departmentId: string;
    departmentName: string;
    departmentCode: string;
    facultyId: string;
    facultyName: string;
    facultyCode: string;
    assignedAt: string;
}

export interface UserUniversity {
    id: string;
    name: string;
    code: string;
    email: string | null;
    phone: string | null;
    address: string | null;
}

export interface UserDepartment {
    id: string;
    name: string;
    code: string;
    type: string;
    faculty: {
        id: string;
        name: string;
        code: string;
    };
}

export interface UserData {
    id: string;
    email: string;
    name: string;
    role: string;
    roles?: string[];
    phone?: string | null;
    avatar?: string | null;
}

// ── Auth store state ────────────────────────────────────────────────

export interface AuthState {
    token: string;
    role: string;
    tenantId: string;
    universityId: string;
    facultyId: string | null;
    departmentId: string | null;
    email?: string;
    username?: string;
    user: UserData | null;
    setAuth: (auth: Partial<AuthState>) => void;
    clearAuth: () => void;
    isAuthenticated: boolean;
}

// ── Login ────────────────────────────────────────────────────────────

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    token: string;
    expiresIn: string;
    user: UserData;
    permissions: {
        facultyId: string;
        departmentId: string;
        universityId: string;
        tenantId: string;
    };
}

export interface UserSession {
    authData: LoginResponse | null;
    isLoggedIn: boolean;
}

export interface LoginProps {
    onLogin: (authData: LoginResponse) => void;
}
