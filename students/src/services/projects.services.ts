import apiClient from "./api";
import { CreateProjectTopicDto, ProjectTopicResponse, MySupervisorResponse } from "../types/projects.types";

const projectService = {
    createProjectTopic: async (data: CreateProjectTopicDto): Promise<ProjectTopicResponse> => {
        const response = await apiClient.post<ProjectTopicResponse>("/project-topics", data);
        return response.data;
    },
    
    getProjectTopics: async (): Promise<{ success: boolean; data: any[] }> => {
        const response = await apiClient.get("/project-topics");
        return response.data;
    },

    getMySupervisor: async (): Promise<MySupervisorResponse> => {
        const response = await apiClient.get<MySupervisorResponse>("/my-supervisor");
        return response.data;
    }
};

export default projectService;
