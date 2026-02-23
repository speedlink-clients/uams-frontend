export interface ResultCourse {
    id: string;
    code: string;
    title: string;
}

export interface StudentResult {
    id: string;
    studentName: string;
    matricNo: string;
    ca: number | null;
    examScore: number | null;
    total: number | null;
    grade: string;
}
