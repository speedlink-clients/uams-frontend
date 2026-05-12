import { useQuery } from "@tanstack/react-query";
import { CourseService } from "@services/course.service";
import type { Course } from "@type/course.type";

export const CourseHook = {
  useAllCourses: () => {
    return useQuery<Course[]>({
      queryKey: ["courses"],
      queryFn: () => CourseService.getAllCourses(),
      staleTime: 5 * 60 * 1000,
    });
  },
};