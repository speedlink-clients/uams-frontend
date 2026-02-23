export interface Student {
    id: string;
    regNo: string;
    matNo: string;
    surname: string;
    otherNames: string;
    email: string;
    phoneNo: string;
    sex: string;
    admissionMode: string;
    entryQualification: string;
    faculty: string;
    department: string;
    degreeCourse: string;
    courseDuration: string;
    degreeAwardCode: string;
}

export interface StudentFilters {
    search: string;
    level: string;
}
