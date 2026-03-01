export interface ResultFile {
    filename: string;
    fileSize: number;
    mimeType: string;
    downloadUrl: string;
}
export interface FinalResult {
    id:string;
    filename: string;
    mimeType: string;
    fileSize: number;
    downloadUrl: string;
}

export interface ResultResponse {
    id: string;
    isApproved: boolean;
    semester: {
        id: string;
        name: string;
    };
    level: {
        id: string;
        name: string;
    };
    session: {
        id: string;
        name: string;
    };
    file: ResultFile;
    finalResult: FinalResult;
}
