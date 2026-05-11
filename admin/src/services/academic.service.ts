import axiosClient from "@configs/axios.config"
import type { Level, Semester, Session } from "@type/academic.type"

export const AcademicServices = {
    getLevels: async (programId?: string): Promise<Level[]> => {
        // If programId not passed, try to extract from token
        let idToUse = programId;
        if (!idToUse) {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    idToUse = payload.programId;
                }
            } catch (e) {
                console.error("Failed to extract programId from token", e);
            }
        }
        if (!idToUse) {
            console.warn("No programId found, returning empty list");
            return [];
        }
        const { data } = await axiosClient.get<Level[]>(`/accademics/${idToUse}`);
        return data;
    },

    getSemesters: async (): Promise<Semester[]> => {
        const { data } = await axiosClient.get<Semester[]>("/accademics/semesters");
        return data;
    },

    getSessions: async (): Promise<Session[]> => {
        const { data } = await axiosClient.get<Session[]>("/accademics/sessions");
        return data;
    },

    createSession: async (payload: Record<string, unknown>): Promise<unknown> => {
        const { data } = await axiosClient.post("/university-admin/academic-sessions", payload);
        return data;
    },

    updateSession: async (id: string, payload: Record<string, unknown>): Promise<unknown> => {
        const { data } = await axiosClient.put(`/university-admin/academic-sessions/${id}`, payload);
        return data;
    },

    deleteSession: async (id: string): Promise<unknown> => {
        const { data } = await axiosClient.delete(`/university-admin/academic-sessions/${id}`);
        return data;
    },

    getAcademicSessions: async (): Promise<unknown[]> => {
        const { data } = await axiosClient.get("/university-admin/academic-sessions");
        return data;
    },
}
