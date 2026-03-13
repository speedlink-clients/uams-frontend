import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { AcademicService } from "@services/academic.service";
import type { Session } from "@type/academic.type";

export const AcademicHook = {
    useSessions: (options?: Partial<UseQueryOptions<Session[]>>) =>
        useQuery<Session[]>({
            queryKey: ["sessions"],
            queryFn: AcademicService.getSessions,
            staleTime: 10 * 60 * 1000,
            ...options,
        }),
    
    useActiveSession: (options?: Partial<UseQueryOptions<Session | undefined>>) =>
        useQuery<Session | undefined>({
            queryKey: ["sessions", "active"],
            queryFn: async () => {
                const sessions = await AcademicService.getSessions();
                return sessions.find(s => s.isActive);
            },
            staleTime: 10 * 60 * 1000,
            ...options,
        }),
};
