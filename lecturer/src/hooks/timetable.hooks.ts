import { TimetableService } from "@services/timetable.service";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { TimetableItem } from "@type/timetable.type";

// ── Hooks ────────────────────────────────────────────────────────────

export const TimetableHook = {
    useTimetable: (
        options?: Partial<UseQueryOptions<TimetableItem[]>>
    ) =>
        useQuery<TimetableItem[]>({
            queryKey: ["timetable"],
            // TODO: swap with TimetableService.getTimetable()
            queryFn: async () => TimetableService.getTimetable(),
            staleTime: 5 * 60 * 1000,
            ...options,
        }),
}

