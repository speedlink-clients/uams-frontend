import { AcademicServices } from "@services/academic.service"
import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query"
import type { Level, Semester, Session } from "@type/academic.type"

export const AcademicHooks = {
    useLevels: (programId?: string, options?: Partial<UseQueryOptions<Level[]>>) => useQuery<Level[]>({
        queryKey: ["levels", programId],
        queryFn: () => AcademicServices.getLevels(programId),
        ...options,
    }),

    useSemesters: (options?: Partial<UseQueryOptions<Semester[]>>) => useQuery<Semester[]>({
        queryKey: ["semesters"],
        queryFn: () => AcademicServices.getSemesters(),
        ...options,
    }),

    useSessions: (options?: Partial<UseQueryOptions<Session[]>>) => useQuery<Session[]>({
        queryKey: ["sessions"],
        queryFn: () => AcademicServices.getSessions(),
        ...options,
    }),

    useAcademicSessions: (options?: Partial<UseQueryOptions<unknown[]>>) => useQuery<unknown[]>({
        queryKey: ["academic-sessions"],
        queryFn: () => AcademicServices.getAcademicSessions(),
        ...options,
    }),

    useCreateSession: (options?: UseMutationOptions<unknown, Error, Record<string, unknown>>) =>
        useMutation({ mutationFn: AcademicServices.createSession, ...options }),

    useUpdateSession: (options?: UseMutationOptions<unknown, Error, { id: string; payload: Record<string, unknown> }>) =>
        useMutation({ mutationFn: ({ id, payload }) => AcademicServices.updateSession(id, payload), ...options }),

    useDeleteSession: (options?: UseMutationOptions<unknown, Error, string>) =>
        useMutation({ mutationFn: AcademicServices.deleteSession, ...options }),
}
