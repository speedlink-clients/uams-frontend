import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Lecturer } from "@type/lecturer.type";

// ── Mock Data (remove when APIs are ready) ──────────────────────────

const CATEGORIES = [
    "Senior Lecturer",
    "Associate Professor",
    "Professor",
    "Senior Lecturer",
    "Junior Lecturer",
    "Senior Lecturer",
    "Senior Lecturer",
    "Junior Lecturer",
    "Senior Lecturer",
    "Senior Lecturer",
    "Senior Lecturer",
    "Senior Lecturer",
];

const MOCK_LECTURERS: Lecturer[] = Array.from({ length: 12 }, (_, i) => ({
    id: String(i + 1),
    staffId: "U2020/2502201",
    name: "Justice Amadi",
    email: "justiceamadi@gmail.com",
    phoneNo: "+2348012345678",
    category: CATEGORIES[i] ?? "Senior Lecturer",
    role: "N/A",
}));

// ── Hooks ────────────────────────────────────────────────────────────

export const LecturerHook = {
    useLecturers: (
        search?: string,
        options?: Partial<UseQueryOptions<Lecturer[]>>
    ) =>
        useQuery<Lecturer[]>({
            queryKey: ["lecturers", search],
            // TODO: swap with LecturerService.getLecturers(search) when API is ready
            queryFn: async () => MOCK_LECTURERS,
            staleTime: 5 * 60 * 1000,
            ...options,
        }),
};
