import { ResultService } from "@services/result.service";
import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import type { ResultResponse } from "@type/result.type";

// ── Hooks ────────────────────────────────────────────────────────────

export const ResultHook = {
    useResults: (courseCode: string, options?: Partial<UseQueryOptions<ResultResponse[]>>
    ) =>
        useQuery<ResultResponse[]>({
            queryKey: ["results", courseCode],
            queryFn: async () => ResultService.getResults(courseCode),
            staleTime: 5 * 60 * 1000,
            ...options,
        }),

    useUploadResult: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (formData: FormData) => ResultService.uploadResult(formData),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["results"] });
            },
        });
    },
};
