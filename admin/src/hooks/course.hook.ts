import { CourseServices } from "@services/course.service";
import { ProgramServices } from "@services/program.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@components/ui/toaster";

export const CourseHook = {
    useCourses: (filters: { level?: string; semester?: string }) =>
        useQuery({
            queryKey: ["courses", filters],
            queryFn: async () => {
                const response = await CourseServices.getCourses(filters);
                const data = Array.isArray(response)
                    ? response
                    : (response as any)?.data || (response as any)?.courses || [];
                return data;
            },
        }),

    useProgramTypes: () =>
        useQuery({
            queryKey: ["program-types"],
            queryFn: async () => {
                const response = await ProgramServices.getProgramTypes();
                const data = Array.isArray(response)
                    ? response
                    : (response as any)?.data || [];
                return data;
            },
        }),

    useCreateCourse: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (formData: any) => {
                return await CourseServices.createCourse({
                    ...formData,
                    units: Number(formData.units),
                } as any);
            },
            onSuccess: () => {
                toaster.success({ title: "Course created successfully" });
                queryClient.invalidateQueries({ queryKey: ["courses"] });
            },
            onError: (error: any) => {
                toaster.error({
                    title: error.response?.data?.message || "Failed to create course",
                });
            },
        });
    },

    useDeleteCourse: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (id: string) => {
                return await CourseServices.deleteCourse(id);
            },
            onSuccess: () => {
                toaster.success({ title: "Course deleted successfully" });
                queryClient.invalidateQueries({ queryKey: ["courses"] });
            },
            onError: () => {
                toaster.error({ title: "Failed to delete course" });
            },
        });
    },

    useBulkUploadCourses: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (formData: FormData) => {
                return await CourseServices.bulkUploadCourses(formData);
            },
            onSuccess: () => {
                toaster.success({ title: "Courses uploaded successfully!" });
                queryClient.invalidateQueries({ queryKey: ["courses"] });
            },
            onError: (err: any) => {
                toaster.error({ title: err.response?.data?.message || "Failed to upload courses" });
            },
        });
    },
};
