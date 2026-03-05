import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import { ProjectService } from "@services/project.service";
import type { ProjectsResponse, ProjectTopic } from "@type/project.type";

export const ProjectHook = {
    useProjects: (
        filters?: Record<string, string>,
        options?: Partial<UseQueryOptions<ProjectsResponse>>
    ) =>
        useQuery<ProjectsResponse>({
            queryKey: ["projects", filters],
            queryFn: async () => ProjectService.getProjects(filters),
            staleTime: 5 * 60 * 1000,
            ...options,
        }),

    useUpdateProject: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: ({ id, payload }: { id: string; payload: Partial<ProjectTopic> }) => ProjectService.updateProject(id, payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["projects"] });
            }
        });
    }
};
