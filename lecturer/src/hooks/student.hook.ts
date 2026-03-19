import { StudentService } from "@services/student.service";
import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query";
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
        options?: Partial<UseMutationOptions<any, any, {
            lecturerId: string;
            sessionId: string;
            studentIds: string[];
            notes: string;
        }>>
    ) =>
        useMutation({
            mutationFn: (payload) => StudentService.assignStudents(payload),
            ...options,
        }),

    useRemoveAssignedStudent: (
        options?: Partial<UseMutationOptions<any, any, {
            lecturerId: string;
            studentId: string;
            sessionId: string;
        }>>
    ) =>
        useMutation({
            mutationFn: ({ lecturerId, studentId, sessionId }) => 
                StudentService.removeAssignedStudent(lecturerId, studentId, sessionId),
            ...options,
        }),
};