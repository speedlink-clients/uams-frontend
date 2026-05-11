import { StaffServices } from "@services/staff.service"
import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query"
import type { CreateLecturerPayload } from "@type/staff.type"
import type { AssignCoursePayload } from "@type/course.type"

export const StaffHooks = {
    useStaff: (options?: Partial<UseQueryOptions<unknown>>) => useQuery<unknown>({
        queryKey: ["staff"],
        queryFn: StaffServices.getDepartmentLecturers,
        ...options,
    }),

    useAddLecturer: (options?: UseMutationOptions<unknown, Error, CreateLecturerPayload>) =>
        useMutation({ mutationFn: StaffServices.addLecturer, ...options }),

    useUpdateLecturer: (options?: UseMutationOptions<unknown, Error, { id: string; data: Partial<CreateLecturerPayload> }>) =>
        useMutation({ mutationFn: ({ id, data }) => StaffServices.updateLecturer(id, data), ...options }),

    useAssignCourses: (options?: UseMutationOptions<unknown, Error, { lecturerId: string; payload: AssignCoursePayload }>) =>
        useMutation({ mutationFn: ({ lecturerId, payload }) => StaffServices.assignCourses(lecturerId, payload), ...options }),

    useBulkDownloadStaff: (options?: UseMutationOptions<unknown, Error, string[]>) =>
        useMutation({ mutationFn: StaffServices.bulkDownloadStaff, ...options }),

    useBulkDeleteStaff: (options?: UseMutationOptions<unknown, Error, string[]>) =>
        useMutation({ mutationFn: StaffServices.bulkDeleteStaff, ...options }),

    useBulkUploadLecturers: (options?: UseMutationOptions<unknown, Error, FormData>) =>
        useMutation({ mutationFn: StaffServices.bulkUploadLecturers, ...options }),
}
