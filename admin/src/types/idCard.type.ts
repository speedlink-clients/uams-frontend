export interface Student {
    id: string;
    idNo: string;
    name: string;
    matric: string;
    faculty: string;
    department: string;
    level: string;
    graduationDate: string;
    hasPaidIDCardFee: boolean;
    avatar: string;
}

export interface IDCardSettings {
    backTemplate?: string;
    frontTemplate?: string;
    backDescription?: string;
    backDisclaimer?: string;
    signature?: string;
}