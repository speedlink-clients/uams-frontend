// @type/auth.type.ts
export interface AuthState {
    token: string;
    refreshToken: string;
    expireAt: string;
    user?: {
        id?: string;
        role: string;
        // other user fields as needed
    };
    setAuth: (auth: Partial<AuthState>) => void;
    clearAuth: () => void;
}