import { CourseServices } from "@services/course.service"
import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query"
import type { Course, CreateCourseData, CoursesApiResponse } from "@type/course.type"

export const CourseHooks = {
    useCourses: (options?: Partial<UseQueryOptions<CoursesApiResponse>>) => useQuery<CoursesApiResponse>({
        queryKey: ["courses"],
        queryFn: CourseServices.getCoursesByDepartment,
        ...options,
    }),

    useCreateCourse: (options?: UseMutationOptions<Course, Error, CreateCourseData>) =>
        useMutation({ mutationFn: CourseServices.createCourse, ...options }),

    useUpdateCourse: (options?: UseMutationOptions<Course, Error, { id: string; data: Record<string, unknown> }>) =>
        useMutation({ mutationFn: ({ id, data }) => CourseServices.updateCourse(id, data), ...options }),

    useUpdateCourseStatus: (options?: UseMutationOptions<Course, Error, { id: string; isActive: boolean }>) =>
        useMutation({ mutationFn: ({ id, isActive }) => CourseServices.updateCourseStatus(id, isActive), ...options }),

    useDeleteCourse: (options?: UseMutationOptions<void, Error, string>) =>
        useMutation({ mutationFn: CourseServices.deleteCourse, ...options }),

    useBulkUploadCourses: (options?: UseMutationOptions<unknown, Error, FormData>) =>
        useMutation({ mutationFn: CourseServices.bulkUploadCourses, ...options }),
}
