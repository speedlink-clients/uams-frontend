import axiosClient from "@configs/axios.config";
import type { Course, CourseStudent } from "@type/course.type";

export const CourseService = {
    getCourses: async (params?: Record<string, string>): Promise<Course[]> => {
        const { data } = await axiosClient.get<{ data: Course[] }>("/lecturers/courses", { params });
        return data.data;
    },
    checkCourseOwnership: async (courseId: string): Promise<{ isAssigned: boolean }> => {
        const { data } = await axiosClient.get<{ data: { isAssigned: boolean } }>(
            `/lecturers/courses/${courseId}/isMine`
        );
        return data.data;
    },
    getCourseById: async (id: string): Promise<Course> => {
        const { data } = await axiosClient.get<{ data: Course }>(`/lecturers/courses/${id}`);
        return data.data;
    },
    getCourseStudents: async (courseId: string, search?: string): Promise<CourseStudent[]> => {
        const { data } = await axiosClient.get<{ data: CourseStudent[] }>(
            `/lecturers/courses/${courseId}/students`,
            { params: search ? { search } : undefined }
        );
        return data.data;
    },
    getCourseStudentById: async (courseId: string, studentId: string): Promise<CourseStudent> => {
        const { data } = await axiosClient.get<CourseStudent>(
            `/lecturer/courses/${courseId}/students/${studentId}`
        );
        return data;
    },
    getAssignedCourses: async (): Promise<Course[]> => {
        const allCourses = await CourseService.getCourses();
        const ownershipChecks = await Promise.all(
            allCourses.map(course => CourseService.checkCourseOwnership(course.id))
        );
        return allCourses.filter((_, index) => ownershipChecks[index].isAssigned);
    },
};