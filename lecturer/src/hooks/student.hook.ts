import { StudentService } from "@services/student.service";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Student, StudentFilters } from "@type/student.type";


// ── Hooks ────────────────────────────────────────────────────────────

export const StudentHook = {
    useStudents: (
        filters?: StudentFilters,
        options?: Partial<UseQueryOptions<Student[]>>
    ) =>
        useQuery<Student[]>({
            queryKey: ["students", filters],
            // TODO: swap with StudentService.getStudents(filters) when API is ready
            queryFn: () => StudentService.getStudents(filters),
            staleTime: 5 * 60 * 1000,
            ...options,
        }),
};
