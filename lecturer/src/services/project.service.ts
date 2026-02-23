import axiosClient from "@configs/axios.config";
import type { Project } from "@type/project.type";

export const ProjectService = {
    getProjects: async (params?: Record<string, string>): Promise<Project[]> => {
        const { data } = await axiosClient.get<Project[]>("/lecturer/projects", { params });
        return data;
    },
};
