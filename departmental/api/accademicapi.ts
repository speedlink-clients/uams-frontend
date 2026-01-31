// api/academicsApi.ts

import api from "./axios";

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

const getProgramIdFromToken = () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return null;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.programId;
    } catch (e) {
        console.error("Failed to extract programId from token", e);
        return null;
    }
};

/** API */
export const academicsApi = {
  async getLevels(): Promise<Level[]> {
    const programId = getProgramIdFromToken();
    if (!programId) {
        console.warn("No programId found in token, defaulting to empty list or base endpoint");
        return []; 
    }
    const res = await api.get(`/accademics/${programId}`);
    return res.data;
  },

  async getSemesters(): Promise<Semester[]> {
    const res = await api.get("/accademics/semesters");
    return res.data;
  },

  async getSessions(): Promise<{ id: string; name: string }[]> {
    const res = await api.get("/accademics/sessions");
    return res.data;
  },

  async createSession(payload: any): Promise<any> {
    const res = await api.post("/university-admin/academic-sessions", payload);
    return res.data;
  },

  async updateSession(id: string, payload: any): Promise<any> {
    const res = await api.put(`/university-admin/academic-sessions/${id}`, payload);
    return res.data;
  },

  async deleteSession(id: string): Promise<any> {
    const res = await api.delete(`/university-admin/academic-sessions/${id}`);
    return res.data;
  },

  async getAcademicSessions(): Promise<any[]> {
    const res = await api.get("/university-admin/academic-sessions");
    return res.data;
  },
};
