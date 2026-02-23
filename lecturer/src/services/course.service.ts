import axiosClient from "@configs/axios.config";
import type { Course, CourseStudent, CourseLecturer } from "@type/course.type";

export const CourseService = {
    getCourses: async (params?: Record<string, string>): Promise<Course[]> => {
        const { data } = await axiosClient.get<Course[]>("/lecturer/courses", { params });
        return data;
    },

    getCourseById: async (id: string): Promise<{ course: Course; lecturers: CourseLecturer[] }> => {
        const { data } = await axiosClient.get(`/lecturer/courses/${id}`);
        return data;
    },

    getCourseStudents: async (courseId: string, search?: string): Promise<CourseStudent[]> => {
        const { data } = await axiosClient.get<CourseStudent[]>(`/lecturer/courses/${courseId}/students`, {
            params: search ? { search } : undefined,
        });
        return data;
    },

    getCourseStudentById: async (courseId: string, studentId: string): Promise<CourseStudent> => {
        const { data } = await axiosClient.get<CourseStudent>(`/lecturer/courses/${courseId}/students/${studentId}`);
        return data;
    },
};
