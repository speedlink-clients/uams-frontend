export interface TransactionsListProps {
    onBack: () => void;
    programTypeId?: string | null;
    programTypeName?: string;
}

export interface TransactionItem {
    transactionReference: string;
    transactionId: string;
    paymentFrom: string;
    studentName: string;
    studentRegNumber: string;
    paymentFor: string;
    paymentType: string;
    amount: string;
    currency: string;
    date: string;
    status: string;
    sessionId: string;
    sessionName: string;
    statusBadge: string;
}

export interface ProgramPayments {
    programInfo: { id: string; name: string; code: string };
    accessFee: TransactionItem[];
    idCardFee: TransactionItem[];
    transcriptFee: TransactionItem[];
    otherPayments: TransactionItem[];
}

export interface ProgramTypeSummary {
    id: string;
    name: string;
    code: string;
    accessFee: { amount: number };
    idCardFee: { amount: number };
    transcriptFee: { amount: number };
}

// Updated to match actual backend response
export interface TranscriptApplication {
    id: string;
    status: string;
    paymentStatus: string;
    recipientName: string;
    recipientEmail: string;
    deliveryMethod: string;
    purpose: string;
    feeAmount: string;
    institutionName: string;
    createdAt: string;
    paidAt: string | null;
    student: {
        id: string;
        fullName: string;
        email: string;
        registrationNo: string;
        studentId: string;
        department: string;
    };
}