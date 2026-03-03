import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import projectService from "../services/projects.services";
import { CreateProjectTopicDto } from "../types/projects.types";

const ProjectHooks = {
    useProjectTopics: () => {
        return useQuery({
            queryKey: ["projectTopics"],
            queryFn: () => projectService.getProjectTopics(),
        });
    },

    useCreateProjectTopic: () => {
        const queryClient = useQueryClient();
        
        return useMutation({
            mutationFn: (data: CreateProjectTopicDto) => projectService.createProjectTopic(data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["projectTopics"] });
            },
        });
    },

    useMySupervisor: () => {
        return useQuery({
            queryKey: ["mySupervisor"],
            queryFn: () => projectService.getMySupervisor(),
        });
    }
};

export default ProjectHooks;
