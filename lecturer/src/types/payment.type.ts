// ── Payment Summary ──────────────────────────────────────────────────

export interface ProgramTypeSummary {
    id: string;
    name: string;
    code: string;
    totalAmount: string;
    totalPayments: number;
    accessFee: { total: string; count: number; amount: number; average: string | number };
    idCardFee: { total: string; count: number; amount: number; average: string | number };
    transcriptFee: { total: string; count: number; amount: number; average: string | number };
    otherPayments: { total: string; count: number; amount: number };
}

export interface ProgramRevenue {
    programTypeId: string;
    programType: string;
    accessFee: number;
    idCardFee: number;
    transcriptFee: number;
}

// ── Transaction Details ──────────────────────────────────────────────

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

// ── API Response Shape ───────────────────────────────────────────────

export interface PaymentsApiResponse {
    success: boolean;
    data: {
        summary: {
            programTypes: Record<string, ProgramTypeSummary>;
        };
        paymentsByProgramType: ProgramPayments[];
    };
}

// ── Component Props ──────────────────────────────────────────────────

export type PaymentTab = "Access Fee" | "ID Card" | "Transcript";
