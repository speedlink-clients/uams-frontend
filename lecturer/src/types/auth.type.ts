// @type/auth.type.ts
export interface User {
    id?: string;
    role?: string;
    roles?: string[];
    email?: string;
    name?: string;
    [key: string]: any;
}

export interface AuthState {
    token: string;
    refreshToken?: string;
    expireAt: string;
    user?: User;
    setAuth: (auth: Partial<AuthState>) => void;
    clearAuth: () => void;
}