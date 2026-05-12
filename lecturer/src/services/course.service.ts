import axiosClient from "@configs/axios.config";
import type { Course, ApiResponse } from "@type/course.type";

export const CourseService = {
  getAllCourses: async (): Promise<Course[]> => {
    const { data } = await axiosClient.get<ApiResponse<Course[]>>("/courses");
    return data.data;
  },
};