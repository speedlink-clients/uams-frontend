import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Student, StudentFilters } from "@type/student.type";

// ── Mock Data (remove when APIs are ready) ──────────────────────────

const createMockStudent = (index: number): Student => ({
    id: String(index),
    regNo: "20244089597484",
    matNo: "U2005/2502031",
    surname: "Justice",
    otherNames: "Amadi Okafor",
    email: "j.ariceanme@gmail.com",
    phoneNo: "+23480/2345976",
    sex: "Male",
    admissionMode: "UTME",
    entryQualification: "O-LEVEL",
    faculty: "Computing",
    department: "Computer Science",
    degreeCourse: "Computer Science",
    courseDuration: "4 Yrs",
    degreeAwardCode: "B.SC",
});

const MOCK_STUDENTS: Student[] = Array.from({ length: 9 }, (_, i) =>
    createMockStudent(i + 1)
);

// ── Hooks ────────────────────────────────────────────────────────────

export const StudentHook = {
    useStudents: (
        filters?: StudentFilters,
        options?: Partial<UseQueryOptions<Student[]>>
    ) =>
        useQuery<Student[]>({
            queryKey: ["students", filters],
            // TODO: swap with StudentService.getStudents(filters) when API is ready
            queryFn: async () => MOCK_STUDENTS,
            staleTime: 5 * 60 * 1000,
            ...options,
        }),
};
