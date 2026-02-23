import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Course, CourseLecturer, CourseStudent, CourseFilters } from "@type/course.type";

// ── Mock Data ────────────────────────────────────────────────────────

const MOCK_COURSES: Course[] = [
    { id: "1", code: "CSC201.1", title: "Computer Science Introduction", description: "An introductory course designed to equip students with fundamental programming concepts and problem-solving skills using a modern programming language. The course emphasizes logical thinking, algorithm development, and the practical implementation of computational solutions to real-world problems.", creditUnit: 3, programType: "Regular", level: "200", semester: "First Semester" },
    { id: "2", code: "CSC201.1", title: "Computer Science Introduction", description: "An introductory course designed to equip students with fundamental programming concepts.", creditUnit: 3, programType: "Regular", level: "200", semester: "First Semester" },
    { id: "3", code: "GES201.1", title: "General Studies", description: "A general studies course covering communication and analytical skills.", creditUnit: 2, programType: "Regular", level: "200", semester: "First Semester" },
    { id: "4", code: "MTH210.1", title: "Advanced Calculus", description: "An advanced course in mathematical calculus and its applications.", creditUnit: 3, programType: "Regular", level: "200", semester: "First Semester" },
    { id: "5", code: "CSC201.1", title: "Computer Science Introduction", description: "An introductory course in computer science.", creditUnit: 3, programType: "Regular", level: "200", semester: "First Semester" },
    { id: "6", code: "CSC201.1", title: "Computer Science Introduction", description: "An introductory course in computer science.", creditUnit: 3, programType: "Regular", level: "200", semester: "First Semester" },
    { id: "7", code: "CSC201.1", title: "Computer Science Introduction", description: "An introductory course in computer science.", creditUnit: 3, programType: "Regular", level: "200", semester: "First Semester" },
    { id: "8", code: "CSC201.1", title: "Computer Science Introduction", description: "An introductory course in computer science.", creditUnit: 3, programType: "Regular", level: "200", semester: "First Semester" },
];

const MOCK_LECTURERS: CourseLecturer[] = [
    { id: "1", name: "Dr. Joseph Ike" },
    { id: "2", name: "Dr. Joseph Ike" },
    { id: "3", name: "Dr. Joseph Ike" },
    { id: "4", name: "Dr. Joseph Ike" },
];

const createMockCourseStudent = (i: number): CourseStudent => ({
    id: String(i),
    regNo: "20244096597484",
    matNo: "U2020/2502201",
    surname: "Justice",
    otherNames: "Amadi Okafor",
    email: "justiceamadi@gmail.com",
    phoneNo: "+2348012345678",
    sex: "Male",
    admissionMode: "UTME",
    entryQualification: "O-LEVEL",
    department: "COMPUTER SCIENCE",
    faculty: "COMPUTING",
    degreeCourse: "COMPUTER SCIENCE",
    programDuration: "4",
    degreeAwarded: "B.SC",
    attendancePresent: 70,
    attendanceAbsent: 30,
});

const MOCK_COURSE_STUDENTS: CourseStudent[] = Array.from({ length: 8 }, (_, i) =>
    createMockCourseStudent(i + 1)
);

// ── Hooks ────────────────────────────────────────────────────────────

export const CourseHook = {
    useCourses: (
        filters?: CourseFilters,
        options?: Partial<UseQueryOptions<Course[]>>
    ) =>
        useQuery<Course[]>({
            queryKey: ["courses", filters],
            // TODO: swap with CourseService.getCourses()
            queryFn: async () => MOCK_COURSES,
            staleTime: 5 * 60 * 1000,
            ...options,
        }),

    useCourse: (
        id: string,
        options?: Partial<UseQueryOptions<{ course: Course; lecturers: CourseLecturer[] }>>
    ) =>
        useQuery<{ course: Course; lecturers: CourseLecturer[] }>({
            queryKey: ["course", id],
            // TODO: swap with CourseService.getCourseById(id)
            queryFn: async () => ({
                course: MOCK_COURSES[0],
                lecturers: MOCK_LECTURERS,
            }),
            staleTime: 5 * 60 * 1000,
            ...options,
        }),

    useCourseStudents: (
        courseId: string,
        search?: string,
        options?: Partial<UseQueryOptions<CourseStudent[]>>
    ) =>
        useQuery<CourseStudent[]>({
            queryKey: ["courseStudents", courseId, search],
            // TODO: swap with CourseService.getCourseStudents(courseId, search)
            queryFn: async () => MOCK_COURSE_STUDENTS,
            staleTime: 5 * 60 * 1000,
            ...options,
        }),

    useCourseStudent: (
        courseId: string,
        studentId: string,
        options?: Partial<UseQueryOptions<CourseStudent>>
    ) =>
        useQuery<CourseStudent>({
            queryKey: ["courseStudent", courseId, studentId],
            // TODO: swap with CourseService.getCourseStudentById(courseId, studentId)
            queryFn: async () => createMockCourseStudent(Number(studentId)),
            staleTime: 5 * 60 * 1000,
            ...options,
        }),
};
