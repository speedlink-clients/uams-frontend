import { CourseService } from "@services/course.service";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Course, CourseStudent, CourseFilters } from "@type/course.type";

// ── Hooks ────────────────────────────────────────────────────────────

export const CourseHook = {
    useCourses: (
        filters?: CourseFilters,
        options?: Partial<UseQueryOptions<Course[]>>
    ) =>
        useQuery<Course[]>({
            queryKey: ["courses", filters],
            // TODO: swap with CourseService.getCourses()
            queryFn: async () => CourseService.getCourses(),
            staleTime: 5 * 60 * 1000,
            ...options,
        }),
    useCheckCourseOwnership: (
        courseId: string,
        options?: Partial<UseQueryOptions<{
            "isAssigned": boolean
        }>>
    ) =>
        useQuery<{
            "isAssigned": boolean
        }>({
            queryKey: ["checkCourseOwnership", courseId],
            // TODO: swap with CourseService.getCourses()
            queryFn: async () => CourseService.checkCourseOwnership(courseId),
            staleTime: 5 * 60 * 1000,
            ...options,
        }),

    useCourse: (
        id: string,
        options?: Partial<UseQueryOptions<Course>>
    ) =>
        useQuery<Course>({
            queryKey: ["course", id],
            queryFn: async () => CourseService.getCourseById(id),
            ...options,
        }),

    useCourseStudents: (
        courseId: string,
        search?: string,
        options?: Partial<UseQueryOptions<CourseStudent[]>>
    ) =>
        useQuery<CourseStudent[]>({
            queryKey: ["courseStudents", courseId, search],
            queryFn: async () => CourseService.getCourseStudents(courseId, search),
            staleTime: 5 * 60 * 1000,
            ...options,
        }),

    useCourseStudent: (
        courseId: string,
        studentId: string,
        options?: Partial<UseQueryOptions<CourseStudent>>
    ) =>
        useQuery<CourseStudent>({
            queryKey: ["courseStudent", courseId, studentId],
            queryFn: async () => CourseService.getCourseStudentById(courseId, studentId),
            staleTime: 5 * 60 * 1000,
            ...options,
        }),
};
