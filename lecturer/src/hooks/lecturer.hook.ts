import { LecturerService } from "@services/lecturer.service";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Lecturer } from "@type/lecturer.type";

// ── Hooks ────────────────────────────────────────────────────────────

export const LecturerHook = {
    useLecturers: (
        options?: Partial<UseQueryOptions<Lecturer[]>>
    ) =>
        useQuery<Lecturer[]>({
            queryKey: ["lecturers"],
            // TODO: swap with LecturerService.getLecturers() when API is ready
            queryFn: async () => LecturerService.getLecturers(),
            staleTime: 5 * 60 * 1000,
            ...options,
        }),
};
