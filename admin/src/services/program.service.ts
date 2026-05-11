import axiosClient from "@configs/axios.config"
import type { Program, ProgramTypeResponse, CreateProgramData } from "@type/program.type"
import { getCurrentDepartmentId, getCurrentUniversityId } from "@utils/auth.util"

export const ProgramServices = {
    // Program Types
    getProgramTypes: async (): Promise<ProgramTypeResponse[]> => {
        const { data } = await axiosClient.get<ProgramTypeResponse[]>("/program-types");
        return data;
    },

    createProgramType: async (payload: Record<string, unknown>): Promise<ProgramTypeResponse> => {
        const { data } = await axiosClient.post<ProgramTypeResponse>("/programmes", payload);
        return data;
    },

    deleteProgramType: async (id: string): Promise<void> => {
        await axiosClient.delete("/program-types/delete", { data: { ids: [id] } });
    },

    updateProgramType: async (id: string, payload: Record<string, unknown>): Promise<ProgramTypeResponse> => {
        const { data } = await axiosClient.put<ProgramTypeResponse>(`/program-types/${id}`, payload);
        return data;
    },

    bulkDeleteProgramTypes: async (ids: string[]): Promise<void> => {
        await axiosClient.delete("/program-types/delete", { data: { ids } });
    },

    // Programs
    getProgramsByDepartment: async (): Promise<Program[]> => {
        const departmentId = getCurrentDepartmentId();
        if (!departmentId) throw new Error("No department ID found in token");

        const { data } = await axiosClient.get<{ success: boolean; count: number; data: Program[] }>(
            `/program/department/${departmentId}`
        );
        return data.data;
    },

    createProgram: async (formData: CreateProgramData): Promise<Program> => {
        const departmentId = getCurrentDepartmentId();
        const universityId = getCurrentUniversityId();
        if (!departmentId || !universityId) throw new Error("Missing required IDs from authentication token");

        const payload = {
            name: formData.name.trim(),
            code: formData.code.trim(),
            programTypeId: formData.type,
            duration: Number(formData.duration),
            description: formData.description?.trim() || "",
        };

        const { data } = await axiosClient.post<Program>("/program", payload);
        return data;
    },

    updateProgram: async (programId: string, programData: Record<string, unknown>): Promise<Program> => {
        const payload = {
            name: programData.name,
            code: programData.code,
            description: programData.description,
            duration: Number(programData.duration),
            programTypeId: programData.type,
        };
        const { data } = await axiosClient.patch<Program>(`/program/${programId}`, payload);
        return data;
    },

    updateProgramStatus: async (programId: string, programData: { isActive: boolean }): Promise<Program> => {
        const { data } = await axiosClient.patch<Program>(`/program/${programId}`, { isActive: programData.isActive });
        return data;
    },

    deleteProgram: async (programId: string): Promise<void> => {
        await axiosClient.delete(`/program/${programId}`);
    },

    // Credit Limits
    getCreditLimits: async (): Promise<unknown[]> => {
        const { data } = await axiosClient.get("/credit-limit");
        return data;
    },

    createCreditLimit: async (payload: { levelId: string; semesterId: string; maxCreditLoad: number }): Promise<unknown> => {
        const { data } = await axiosClient.post("/credit-limit", payload);
        return data;
    },

    deleteCreditLimit: async (id: string): Promise<void> => {
        await axiosClient.delete(`/credit-limit/${id}`);
    },

    updateCreditLimit: async (id: string, payload: { levelId: string; semesterId: string; maxCreditLoad: number }): Promise<unknown> => {
        const { data } = await axiosClient.put(`/credit-limit/${id}`, payload);
        return data;
    },
}
