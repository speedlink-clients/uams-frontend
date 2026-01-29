// api/academicsApi.ts

import api from "./axios";

export interface Level {
  id: string;
  name: string;
  code: string;
}

export interface Semester {
  id: string;
  name: string;
  isActive: boolean;
}

/** API */
export const academicsApi = {
  async getLevels(): Promise<Level[]> {
    const res = await api.get("/accademics/levels");
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

  async getAcademicSessions(): Promise<any[]> {
    const res = await api.get("/university-admin/academic-sessions");
    return res.data;
  },
};
