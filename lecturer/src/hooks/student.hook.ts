import { StudentService } from "@services/student.service";
import { useMutation, useQuery, useQueryClient, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query";
import type { Student } from "@type/student.type";

export const StudentHook = {
    useStudents: (
        options?: Partial<UseQueryOptions<Student[]>>
    ) =>
        useQuery<Student[]>({
            queryKey: ["students"],
            queryFn: () => StudentService.getStudents(),
            staleTime: 5 * 60 * 1000,
            ...options,
        }),

    useUnassignedStudents: (
        options?: Partial<UseQueryOptions<Student[]>>
    ) =>
        useQuery<Student[]>({
            queryKey: ["unassigned-students"],
            queryFn: () => StudentService.getUnassignedStudents(),
            staleTime: 5 * 60 * 1000,
            ...options,
        }),

    useAssignedStudents: (
        lecturerId: string,
        options?: Partial<UseQueryOptions<Student[]>>
    ) =>
        useQuery<Student[]>({
            queryKey: ["assigned-students", lecturerId],
            queryFn: () => StudentService.getAssignedStudents(lecturerId),
            enabled: !!lecturerId,
            staleTime: 5 * 60 * 1000,
            ...options,
        }),

    useAssignStudents: (
        options?: UseMutationOptions<any, any, {
            lecturerId: string;
            sessionId: string;
            studentIds: string[];
            notes: string;
        }>
    ) => {
        const queryClient = useQueryClient();
        
        return useMutation({
            mutationFn: (payload) => StudentService.assignStudents(payload),
            onSuccess: (data, variables, onMutateResult, context) => {
                // Invalidate both unassigned and assigned students queries
                queryClient.invalidateQueries({ queryKey: ["unassigned-students"] });
                queryClient.invalidateQueries({ 
                    queryKey: ["assigned-students", variables.lecturerId] 
                });
                
                // Call the original onSuccess if provided with all 4 arguments
                if (options?.onSuccess) {
                    options.onSuccess(data, variables, onMutateResult, context);
                }
            },
            ...options,
        });
    },

    useRemoveAssignedStudent: (
        options?: UseMutationOptions<any, any, {
            lecturerId: string;
            studentId: string;
            sessionId: string;
        }>
    ) => {
        const queryClient = useQueryClient();
        
        return useMutation({
            mutationFn: ({ lecturerId, studentId, sessionId }) => 
                StudentService.removeAssignedStudent(lecturerId, studentId, sessionId),
            onSuccess: (data, variables, onMutateResult, context) => {
                // Invalidate both assigned and unassigned students queries
                queryClient.invalidateQueries({ 
                    queryKey: ["assigned-students", variables.lecturerId] 
                });
                queryClient.invalidateQueries({ queryKey: ["unassigned-students"] });
                
                // Call the original onSuccess if provided with all 4 arguments
                if (options?.onSuccess) {
                    options.onSuccess(data, variables, onMutateResult, context);
                }
            },
            ...options,
        });
    },
};