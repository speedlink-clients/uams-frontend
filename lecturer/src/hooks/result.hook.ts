import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { ResultCourse, StudentResult } from "@type/result.type";

// ── Mock Data ────────────────────────────────────────────────────────

const MOCK_RESULT_COURSES: ResultCourse[] = [
    { id: "1", code: "CSC201.1", title: "Computer Science Introduction" },
    { id: "2", code: "CSC201.1", title: "Computer Science Introduction" },
    { id: "3", code: "GES201.1", title: "General Studies" },
    { id: "4", code: "MTH210.1", title: "Advanced Calculus" },
    { id: "5", code: "CSC201.1", title: "Computer Science Introduction" },
    { id: "6", code: "CSC201.1", title: "Computer Science Introduction" },
    { id: "7", code: "CSC201.1", title: "Computer Science Introduction" },
    { id: "8", code: "CSC201.1", title: "Computer Science Introduction" },
];

const MOCK_RESULTS: StudentResult[] = [
    { id: "1", studentName: "Justice Amadi", matricNo: "U2020/3402/111", ca: 30, examScore: 70, total: 100, grade: "A" },
    { id: "2", studentName: "Justice Amadi", matricNo: "U2020/3402/111", ca: 20, examScore: 70, total: 90, grade: "A" },
    { id: "3", studentName: "Justice Amadi", matricNo: "U2020/3402/111", ca: 10, examScore: 70, total: 80, grade: "A" },
    { id: "4", studentName: "Justice Amadi", matricNo: "U2020/3402/111", ca: 10, examScore: 50, total: 60, grade: "B" },
    { id: "5", studentName: "Justice Amadi", matricNo: "U2020/3402/111", ca: null, examScore: null, total: null, grade: "N/A" },
    { id: "6", studentName: "Justice Amadi", matricNo: "U2020/3402/111", ca: 10, examScore: 40, total: 50, grade: "C" },
    { id: "7", studentName: "Justice Amadi", matricNo: "U2020/3402/111", ca: 15, examScore: 20, total: 35, grade: "F" },
    { id: "8", studentName: "Justice Amadi", matricNo: "U2020/3402/111", ca: 10, examScore: 70, total: 100, grade: "A" },
    { id: "9", studentName: "Justice Amadi", matricNo: "U2020/3402/111", ca: 10, examScore: 70, total: 100, grade: "A" },
    { id: "10", studentName: "Justice Amadi", matricNo: "U2020/3402/111", ca: 10, examScore: 70, total: 100, grade: "A" },
    { id: "11", studentName: "Justice Amadi", matricNo: "U2020/3402/111", ca: 20, examScore: 70, total: 100, grade: "A" },
];

// ── Hooks ────────────────────────────────────────────────────────────

export const ResultHook = {
    useResultCourses: (
        filters?: Record<string, string>,
        options?: Partial<UseQueryOptions<ResultCourse[]>>
    ) =>
        useQuery<ResultCourse[]>({
            queryKey: ["resultCourses", filters],
            // TODO: swap with ResultService.getResultCourses(filters)
            queryFn: async () => MOCK_RESULT_COURSES,
            staleTime: 5 * 60 * 1000,
            ...options,
        }),

    useResults: (
        courseId: string,
        tab: "lecturer" | "ero",
        options?: Partial<UseQueryOptions<StudentResult[]>>
    ) =>
        useQuery<StudentResult[]>({
            queryKey: ["results", courseId, tab],
            // TODO: swap with ResultService.getResults(courseId, tab)
            queryFn: async () => MOCK_RESULTS,
            staleTime: 5 * 60 * 1000,
            ...options,
        }),
};
