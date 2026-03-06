import { ProgramServices } from "@services/program.service"
import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query"
import type { Program, ProgramTypeResponse, CreateProgramData } from "@type/program.type"

export const ProgramHooks = {
    useProgramTypes: (options?: Partial<UseQueryOptions<ProgramTypeResponse[]>>) => useQuery<ProgramTypeResponse[]>({
        queryKey: ["program-types"],
        queryFn: ProgramServices.getProgramTypes,
        ...options,
    }),

    usePrograms: (options?: Partial<UseQueryOptions<Program[]>>) => useQuery<Program[]>({
        queryKey: ["programs"],
        queryFn: ProgramServices.getProgramsByDepartment,
        ...options,
    }),

    useCreateProgram: (options?: UseMutationOptions<Program, Error, CreateProgramData>) =>
        useMutation({ mutationFn: ProgramServices.createProgram, ...options }),

    useUpdateProgram: (options?: UseMutationOptions<Program, Error, { id: string; data: Record<string, unknown> }>) =>
        useMutation({ mutationFn: ({ id, data }) => ProgramServices.updateProgram(id, data), ...options }),

    useUpdateProgramStatus: (options?: UseMutationOptions<Program, Error, { id: string; isActive: boolean }>) =>
        useMutation({ mutationFn: ({ id, isActive }) => ProgramServices.updateProgramStatus(id, { isActive }), ...options }),

    useDeleteProgram: (options?: UseMutationOptions<void, Error, string>) =>
        useMutation({ mutationFn: ProgramServices.deleteProgram, ...options }),

    useCreateProgramType: (options?: UseMutationOptions<ProgramTypeResponse, Error, Record<string, unknown>>) =>
        useMutation({ mutationFn: ProgramServices.createProgramType, ...options }),

    useDeleteProgramType: (options?: UseMutationOptions<void, Error, string>) =>
        useMutation({ mutationFn: ProgramServices.deleteProgramType, ...options }),

    useUpdateProgramType: (options?: UseMutationOptions<ProgramTypeResponse, Error, { id: string; data: Record<string, unknown> }>) =>
        useMutation({ mutationFn: ({ id, data }) => ProgramServices.updateProgramType(id, data), ...options }),

    useCreditLimits: (options?: Partial<UseQueryOptions<unknown[]>>) => useQuery<unknown[]>({
        queryKey: ["credit-limits"],
        queryFn: ProgramServices.getCreditLimits,
        ...options,
    }),

    useCreateCreditLimit: (options?: UseMutationOptions<unknown, Error, { levelId: string; semesterId: string; maxCreditLoad: number }>) =>
        useMutation({ mutationFn: ProgramServices.createCreditLimit, ...options }),

    useDeleteCreditLimit: (options?: UseMutationOptions<void, Error, string>) =>
        useMutation({ mutationFn: ProgramServices.deleteCreditLimit, ...options }),

    useUpdateCreditLimit: (options?: UseMutationOptions<unknown, Error, { id: string; data: { levelId: string; semesterId: string; maxCreditLoad: number } }>) =>
        useMutation({ mutationFn: ({ id, data }) => ProgramServices.updateCreditLimit(id, data), ...options }),
}
