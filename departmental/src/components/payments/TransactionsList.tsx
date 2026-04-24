import { useState, useEffect, useMemo } from "react";
import { Search, Download, Upload, X, ArrowLeft } from "lucide-react";
import { PaymentServices } from "@services/payment.service";
import { toaster } from "@components/ui/toaster";

type PaymentTab = "Access Fee" | "ID Card" | "Transcript";

interface TransactionsListProps {
    onBack: () => void;
    programTypeId?: string | null;
    programTypeName?: string;
}

interface TransactionItem {
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

interface ProgramPayments {
    programInfo: { id: string; name: string; code: string };
    accessFee: TransactionItem[];
    idCardFee: TransactionItem[];
    transcriptFee: TransactionItem[];
    otherPayments: TransactionItem[];
}

interface ProgramTypeSummary {
    id: string;
    name: string;
    code: string;
    accessFee: { amount: number };
    idCardFee: { amount: number };
    transcriptFee: { amount: number };
}

// Updated to match actual backend response
interface TranscriptApplication {
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

const TransactionsList = ({ onBack, programTypeId }: TransactionsListProps) => {
    const [activeTab, setActiveTab] = useState<PaymentTab>("Access Fee");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sessionFilter, setSessionFilter] = useState("all");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const [programPayments, setProgramPayments] = useState<ProgramPayments | null>(null);
    const [programSummary, setProgramSummary] = useState<ProgramTypeSummary | null>(null);
    const [loading, setLoading] = useState(true);

    const [transcriptApps, setTranscriptApps] = useState<TranscriptApplication[]>([]);
    const [loadingTranscript, setLoadingTranscript] = useState(false);

    const tabs: PaymentTab[] = ["Access Fee", "ID Card", "Transcript"];

    // 1. Fetch payment summary (for Access Fee & ID Card)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await PaymentServices.getPaymentsSummary();

                if (response.success) {
                    const data = response.data;
                    const match = data.paymentsByProgramType?.find(
                        (p: ProgramPayments) => p.programInfo.id === programTypeId
                    );
                    if (match) setProgramPayments(match);

                    const summaries: Record<string, ProgramTypeSummary> = data.summary?.programTypes || {};
                    const summaryMatch = Object.values(summaries).find((s) => s.id === programTypeId);
                    if (summaryMatch) setProgramSummary(summaryMatch);
                } else {
                    toaster.error({ title: "Failed to load transactions" });
                }
            } catch (error) {
                console.error("Fetch transactions error:", error);
                toaster.error({ title: "Failed to fetch transactions" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [programTypeId]);

    // 2. Fetch transcript applications only when Transcript tab is active
    useEffect(() => {
        if (activeTab !== "Transcript") return;

        const fetchTranscriptApps = async () => {
            setLoadingTranscript(true);
            try {
                const response = await PaymentServices.getTranscriptApplications(programTypeId || undefined);
                // response structure: { success: true, data: [...] }
                const apps = response?.data || [];
                setTranscriptApps(Array.isArray(apps) ? apps : []);
            } catch (error) {
                console.error("Failed to fetch transcript applications:", error);
                toaster.error({ title: "Could not load transcript applications" });
                setTranscriptApps([]);
            } finally {
                setLoadingTranscript(false);
            }
        };

        fetchTranscriptApps();
    }, [activeTab, programTypeId]);

    // Combine transactions based on active tab
    const tabTransactions: TransactionItem[] = useMemo(() => {
        if (activeTab === "Transcript") {
            return transcriptApps.map((app) => ({
                transactionReference: app.id,
                transactionId: app.id,
                paymentFrom: app.student?.fullName || "Unknown",
                studentName: app.student?.fullName || "Unknown",
                studentRegNumber: app.student?.registrationNo || "N/A",
                paymentFor: "Transcript Application",
                paymentType: "transcript",
                amount: app.feeAmount || "0",
                currency: "NGN",
                date: app.createdAt || new Date().toISOString(),
                status: app.paymentStatus === "PAID" ? "success" : 
                        app.paymentStatus === "PENDING" ? "pending" : "failed",
                sessionId: "",
                sessionName: "",
                statusBadge: app.paymentStatus,
            }));
        }

        if (!programPayments) return [];
        switch (activeTab) {
            case "Access Fee": return programPayments.accessFee || [];
            case "ID Card": return programPayments.idCardFee || [];
            default: return [];
        }
    }, [activeTab, programPayments, transcriptApps]);

    const tabTotal = useMemo(() => {
        if (activeTab === "Transcript") {
            return transcriptApps.reduce((sum, app) => sum + parseFloat(app.feeAmount || "0"), 0);
        }
        if (!programSummary) return 0;
        switch (activeTab) {
            case "Access Fee": return programSummary.accessFee.amount;
            case "ID Card": return programSummary.idCardFee.amount;
            default: return 0;
        }
    }, [activeTab, programSummary, transcriptApps]);

    const filteredTransactions = useMemo(() => {
        return tabTransactions.filter((t) => {
            const matchesSearch =
                !searchQuery ||
                t.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.paymentFrom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.transactionReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.studentRegNumber.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === "all" || t.status === statusFilter;

            let matchesDate = true;
            if (dateFrom) matchesDate = matchesDate && new Date(t.date) >= new Date(dateFrom);
            if (dateTo) {
                const toDate = new Date(dateTo);
                toDate.setHours(23, 59, 59, 999);
                matchesDate = matchesDate && new Date(t.date) <= toDate;
            }

            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [tabTransactions, searchQuery, statusFilter, dateFrom, dateTo]);

    const handleClearDateFilters = () => { setDateFrom(""); setDateTo(""); };

    const getStatusStyle = (status: string): React.CSSProperties => {
        switch (status) {
            case "success": return { background: "#dcfce7", color: "#15803d" };
            case "pending": return { background: "#fef9c3", color: "#a16207" };
            case "failed": return { background: "#fee2e2", color: "#dc2626" };
            default: return { background: "#f1f5f9", color: "#475569" };
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "success": return "Success";
            case "pending": return "Pending";
            case "failed": return "Decline";
            default: return status;
        }
    };

    const formatCurrency = (amount: number | string) => {
        const num = typeof amount === "string" ? parseFloat(amount) : amount;
        return "₦" + new Intl.NumberFormat("en-NG").format(num);
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = d.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
    };

    const truncateRef = (ref: string | undefined) => {
        if (!ref) return "N/A";
        if (ref.length <= 20) return ref;
        return ref.substring(0, 8) + "…." + ref.substring(ref.length - 4);
    };

    const handleDownloadReceipt = async (paymentId: string) => {
        try {
            const blob = await PaymentServices.getPaymentReceipt(paymentId);
            const url = URL.createObjectURL(new Blob([blob], { type: blob.type || "application/octet-stream" }));
            const a = document.createElement("a");
            a.href = url;
            a.download = `receipt-${paymentId}${blob.type === "application/pdf" ? ".pdf" : ""}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            toaster.success({ title: "Receipt download started", closable: true });
        } catch {
            toaster.error({ title: "Failed to download receipt", closable: true });
        }
    };

    const tabLabel = activeTab === "Access Fee" ? "Access Fee" : activeTab === "ID Card" ? "ID Card" : "Transcript";
    const isTableLoading = loading || (activeTab === "Transcript" && loadingTranscript);

    const inputStyle: React.CSSProperties = {
        padding: "8px 16px", border: "1px solid #e2e8f0", borderRadius: "999px",
        background: "white", outline: "none", fontSize: "14px", color: "#475569", cursor: "pointer",
    };

    const selectStyle: React.CSSProperties = {
        ...inputStyle, appearance: "none" as const, paddingRight: "32px",
        fontWeight: 500,
    };

    return (
        <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
            <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "8px 8px" }}>
                {/* Back Button */}
                <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", background: "none", border: "none", cursor: "pointer", marginBottom: "16px", fontSize: "14px", fontWeight: 500 }}>
                    <ArrowLeft size={20} />
                    <span>Back to Payments</span>
                </button>

                {/* Tabs */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
                    <div style={{ display: "flex", background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: "10px 24px", fontSize: "14px", fontWeight: 600, border: "none", cursor: "pointer",
                                    background: "white",
                                    color: activeTab === tab ? "#1D7AD9" : "#64748b",
                                    borderBottom: activeTab === tab ? "2px solid #1D7AD9" : "2px solid transparent",
                                    transition: "all 0.2s",
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary Card + Export */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
                    <div style={{ background: "linear-gradient(to right, #e8f5e9, #f1f8e9)", borderRadius: "12px", padding: "24px 32px", display: "flex", alignItems: "center", gap: "16px", minWidth: "min(100%, 400px)", flex: "1 1 auto" }}>
                        <div style={{ height: "48px", width: "48px", borderRadius: "8px", background: "rgba(76,175,80,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Upload size={22} color="#4caf50" />
                        </div>
                        <div>
                            <p style={{ fontSize: "14px", color: "#475569", fontWeight: 500, margin: 0 }}>Total {tabLabel} Payments</p>
                            <h2 style={{ fontSize: "30px", fontWeight: 700, color: "#0f172a", margin: 0 }}>{formatCurrency(tabTotal)}</h2>
                        </div>
                    </div>

                    <button style={{ display: "flex", alignItems: "center", gap: "8px", background: "#1D7AD9", color: "white", padding: "10px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(29,122,217,0.2)" }}>
                        <Download size={18} />
                        Export
                    </button>
                </div>

                {/* Filters */}
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", gap: "16px" }}>
                    <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                        Transaction History <span style={{ color: "#94a3b8" }}>({filteredTransactions.length})</span>
                    </h2>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                        {/* Search */}
                        <div style={{ position: "relative" }}>
                            <input
                                type="text"
                                placeholder="Search by name or transaction ID"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ ...inputStyle, width: "256px", paddingLeft: "40px" }}
                            />
                            <Search size={16} color="#94a3b8" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                        </div>

                        {/* Status Filter */}
                        <div style={{ position: "relative" }}>
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
                                <option value="all">Status</option>
                                <option value="success">Success</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Decline</option>
                            </select>
                            <svg style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", width: "12px", height: "12px", color: "#94a3b8", pointerEvents: "none" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>

                        {/* Session Filter */}
                        <div style={{ position: "relative" }}>
                            <select value={sessionFilter} onChange={(e) => setSessionFilter(e.target.value)} style={selectStyle}>
                                <option value="all">Session</option>
                            </select>
                            <svg style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", width: "12px", height: "12px", color: "#94a3b8", pointerEvents: "none" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>

                        {/* Date From */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "14px", color: "#64748b" }}>From</span>
                            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={inputStyle} />
                        </div>

                        {/* Date To */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "14px", color: "#64748b" }}>To</span>
                            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={inputStyle} />
                        </div>

                        {/* Clear Dates */}
                        {(dateFrom || dateTo) && (
                            <button onClick={handleClearDateFilters} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: "4px" }}>
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Transactions Table */}
                <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden" }}>
                    <div style={{ overflowX: "auto", width: "100%" }}>
                        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse", minWidth: "1200px", tableLayout: "auto" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", width: "56px", whiteSpace: "nowrap" }}>S/N</th>
                                    <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Transaction Id</th>
                                    <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Payment from</th>
                                    <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Payment for</th>
                                    <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Amount</th>
                                    <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Date</th>
                                    <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right", whiteSpace: "nowrap" }}>Status</th>
                                    <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right", whiteSpace: "nowrap" }}>Receipt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isTableLoading ? (
                                    <tr>
                                        <td colSpan={8} style={{ padding: "64px 24px", textAlign: "center", color: "#94a3b8" }}>
                                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                                                <div style={{ width: "16px", height: "16px", border: "2px solid #94a3b8", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                                                Loading transactions...
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} style={{ padding: "64px 24px", textAlign: "center", color: "#94a3b8" }}>
                                            No transactions found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTransactions.map((t, index) => (
                                        <tr key={t.transactionId} style={{ borderBottom: "1px solid #f8fafc" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc80")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                                            <td style={{ padding: "16px 24px", color: "#64748b", fontSize: "14px", whiteSpace: "nowrap" }}>{index + 1}</td>
                                            <td style={{ padding: "16px 24px", color: "#475569", fontFamily: "monospace", fontSize: "12px", whiteSpace: "nowrap" }}>
                                                {truncateRef(t.transactionReference)}
                                            </td>
                                            <td style={{ padding: "16px 24px", color: "#334155", fontWeight: 500, fontSize: "14px", whiteSpace: "nowrap" }}>
                                                {t.studentName}
                                            </td>
                                            <td style={{ padding: "16px 24px", color: "#475569", fontSize: "14px", whiteSpace: "nowrap" }}>
                                                {t.paymentFor}
                                            </td>
                                            <td style={{ padding: "16px 24px", fontWeight: 700, color: "#0f172a", fontSize: "14px", whiteSpace: "nowrap" }}>
                                                {formatCurrency(t.amount)}
                                            </td>
                                            <td style={{ padding: "16px 24px", color: "#64748b", fontSize: "14px", whiteSpace: "nowrap" }}>
                                                {formatDate(t.date)}
                                            </td>
                                            <td style={{ padding: "16px 24px", textAlign: "right", whiteSpace: "nowrap" }}>
                                                <span style={{ ...getStatusStyle(t.status), display: "inline-block", padding: "4px 16px", borderRadius: "999px", fontSize: "12px", fontWeight: 700, whiteSpace: "nowrap" }}>
                                                    {getStatusLabel(t.status)}
                                                </span>
                                            </td>
                                            <td style={{ padding: "16px 24px", textAlign: "right", whiteSpace: "nowrap" }}>
                                                <button
                                                    onClick={() => handleDownloadReceipt(t.transactionId)}
                                                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#1D7AD9", color: "white", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
                                                >
                                                    <Download size={16} />
                                                    Receipt
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
        </div>
    );
};

export default TransactionsList;