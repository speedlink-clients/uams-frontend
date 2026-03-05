import axiosClient from "@configs/axios.config";
import type { ProjectsResponse, ProjectTopic } from "@type/project.type";

export const ProjectService = {
    getProjects: async (params?: Record<string, string>): Promise<ProjectsResponse> => {
        const { data } = await axiosClient.get<ProjectsResponse>("/project-topics/lecturer", { params });
        return data;
    },
    updateProject: async (id: string, payload: Partial<ProjectTopic>): Promise<ProjectTopic> => {
        const { data } = await axiosClient.patch<ProjectTopic>(`/project-topics/${id}`, payload);
        return data;
    },
};
