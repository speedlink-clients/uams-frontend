import axiosClient from "@configs/axios.config"
import type { Course, CreateCourseData, CoursesApiResponse } from "@type/course.type"
import { getCurrentDepartmentId, getCurrentUniversityId } from "@utils/auth.util"

export const CourseServices = {
    getCoursesByDepartment: async (): Promise<CoursesApiResponse> => {
        const departmentId = getCurrentDepartmentId();
        if (!departmentId) throw new Error("No department ID found in token");

        const { data } = await axiosClient.get<CoursesApiResponse>("/courses/my-department");
        return data;
    },

    createCourse: async (courseData: CreateCourseData): Promise<Course> => {
        const payload = {
            ...courseData,
            universityId: getCurrentUniversityId(),
            departmentId: getCurrentDepartmentId(),
        };
        const { data } = await axiosClient.post<Course>("/courses", payload);
        return data;
    },

    deleteCourse: async (courseId: string): Promise<void> => {
        await axiosClient.delete(`/courses/${courseId}`);
    },

    updateCourse: async (courseId: string, courseData: Record<string, unknown>): Promise<Course> => {
        const { data } = await axiosClient.put<Course>(`/courses/${courseId}`, courseData);
        return data;
    },

    updateCourseStatus: async (courseId: string, isActive: boolean): Promise<Course> => {
        const { data } = await axiosClient.put<Course>(`/courses/${courseId}`, { isActive });
        return data;
    },

    bulkUploadCourses: async (formData: FormData): Promise<unknown> => {
        const { data } = await axiosClient.post("/courses/course-bulk-upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    },
}
