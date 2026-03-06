import { StudentServices } from "@services/student.service"
import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query"

export const StudentHooks = {
    useStudents: (options?: Partial<UseQueryOptions<unknown>>) => useQuery<unknown>({
        queryKey: ["students"],
        queryFn: StudentServices.getDepartmentStudents,
        ...options,
    }),

    useStudentProfile: (studentId: string, options?: Partial<UseQueryOptions<unknown>>) => useQuery<unknown>({
        queryKey: ["student-profile", studentId],
        queryFn: () => StudentServices.getStudentProfile(studentId),
        enabled: !!studentId,
        ...options,
    }),

    useBulkUploadStudents: (options?: UseMutationOptions<unknown, Error, File>) =>
        useMutation({ mutationFn: StudentServices.bulkUploadStudents, ...options }),

    useBulkDownloadStudents: (options?: UseMutationOptions<unknown, Error, string[]>) =>
        useMutation({ mutationFn: StudentServices.bulkDownloadStudents, ...options }),

    useBulkDeleteStudents: (options?: UseMutationOptions<unknown, Error, { studentIds: string[]; reason: string }>) =>
        useMutation({ mutationFn: ({ studentIds, reason }) => StudentServices.bulkDeleteStudents(studentIds, reason), ...options }),
}
