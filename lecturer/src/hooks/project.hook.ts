import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Project } from "@type/project.type";

// ── Mock Data ────────────────────────────────────────────────────────

const MOCK_PROJECTS: Project[] = [
    { id: "1", topic: "Online quiz Application", projectType: "Individual", studentNames: ["Hope thompson"], status: "Pending" },
    { id: "2", topic: "Attendance management system", projectType: "Individual", studentNames: ["Vicky Gree"], status: "Pending" },
    { id: "3", topic: "Simple chat Application", projectType: "Individual", studentNames: ["Monalis Cage"], status: "Approved" },
    { id: "4", topic: "Online voting system", projectType: "Individual", studentNames: ["Monalisa Love"], status: "Pending" },
    { id: "5", topic: "Online voting system", projectType: "Individual", studentNames: ["Matthew James"], status: "Approved" },
    { id: "6", topic: "Online voting system", projectType: "Individual", studentNames: ["Berlin Kio"], status: "Pending" },
    { id: "7", topic: "Online quiz Application", projectType: "Individual", studentNames: ["Hope thompson"], status: "Approved" },
    { id: "8", topic: "Attendance management system", projectType: "Group", studentNames: ["Vicky Gree", "Jame joe"], status: "Approved" },
    { id: "9", topic: "Simple chat Application", projectType: "Individual", studentNames: ["Monalis Cage"], status: "Approved" },
    { id: "10", topic: "Online voting system", projectType: "Group", studentNames: ["Monalisa Love", "Mirrian hope"], status: "Pending" },
    { id: "11", topic: "Online voting system", projectType: "Individual", studentNames: ["Matthew James"], status: "Pending" },
];

// ── Hooks ────────────────────────────────────────────────────────────

export const ProjectHook = {
    useProjects: (
        filters?: Record<string, string>,
        options?: Partial<UseQueryOptions<Project[]>>
    ) =>
        useQuery<Project[]>({
            queryKey: ["projects", filters],
            // TODO: swap with ProjectService.getProjects(filters)
            queryFn: async () => MOCK_PROJECTS,
            staleTime: 5 * 60 * 1000,
            ...options,
        }),
};
