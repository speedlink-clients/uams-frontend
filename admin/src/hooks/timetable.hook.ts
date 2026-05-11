import { TimetableService } from "@services/timetable.service";
import { useMutation, type UseMutationOptions, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { TimetableItem, TimetableParams } from "@type/timetable.type";

// ── Hooks ────────────────────────────────────────────────────────────

export const TimetableHook = {
    useTimetable: (
        options?: Partial<UseQueryOptions<TimetableItem[]>>
    ) =>
        useQuery<TimetableItem[]>({
            queryKey: ["timetables"],
            queryFn: async () => TimetableService.getTimetable(),
            staleTime: 5 * 60 * 1000,
            ...options,
        }),
    useUploadTimetable: (
        options?: Partial<UseMutationOptions<void, Error, FormData>>
    ) =>
        useMutation({
            mutationKey: ["upload-timetable"],
            mutationFn: (formData: FormData) => TimetableService.uploadTimetable(formData),
            ...options,
        }),

    useTimetableParams: (
        options?: Partial<UseQueryOptions<TimetableParams>>
    ) =>
        useQuery<TimetableParams>({
            queryKey: ["timetable-params"],
            queryFn: async () => TimetableService.getTimetableParams(),
            ...options,
        }),
}
