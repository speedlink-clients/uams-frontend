import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { PaymentServices } from "@services/payment.service";
import { toaster } from "@components/ui/toaster";

interface PaymentsSummaryViewProps {
    onViewAllRevenue: (programTypeId: string, programTypeName: string) => void;
}

interface ProgramTypeSummary {
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

interface ProgramRevenue {
    programTypeId: string;
    programType: string;
    accessFee: number;
    idCardFee: number;
    transcriptFee: number;
}

const PaymentsSummaryView = ({ onViewAllRevenue }: PaymentsSummaryViewProps) => {
    const [loading, setLoading] = useState(true);
    const [revenueData, setRevenueData] = useState<ProgramRevenue[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await PaymentServices.getPaymentsSummary();

                if (response.success) {
                    const programTypes: Record<string, ProgramTypeSummary> = response.data.summary.programTypes;
                    const rows: ProgramRevenue[] = Object.values(programTypes).map((pt) => ({
                        programTypeId: pt.id,
                        programType: pt.name,
                        accessFee: pt.accessFee.amount,
                        idCardFee: pt.idCardFee.amount,
                        transcriptFee: pt.transcriptFee.amount,
                    }));
                    setRevenueData(rows);
                } else {
                    toaster.error({ title: "Failed to load payment data" });
                }
            } catch (error) {
                console.error("Failed to load summary data:", error);
                toaster.error({ title: "Failed to load revenue summary" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatCurrency = (amount: number) => {
        return "₦" + new Intl.NumberFormat("en-NG").format(amount);
    };

    return (
        <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
            <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "8px 8px" }}>

                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
                    <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Payments History</h1>
                    <button style={{ display: "flex", alignItems: "center", gap: "8px", background: "#1D7AD9", color: "white", padding: "10px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(29,122,217,0.2)" }}>
                        <Download size={18} />
                        Export
                    </button>
                </div>

                {/* Table */}
                <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", overflowX: "auto" }}>
                    <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                                <th style={{ padding: "20px 32px", fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", width: "64px" }}>S/N</th>
                                <th style={{ padding: "20px 32px", fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Program Types</th>
                                <th style={{ padding: "20px 32px", fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Access Fee</th>
                                <th style={{ padding: "20px 32px", fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>ID Card Fee</th>
                                <th style={{ padding: "20px 32px", fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Transcript Fee</th>
                                <th style={{ padding: "20px 32px", fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right" }}>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: "48px 32px", textAlign: "center", color: "#94a3b8" }}>
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                                            <div style={{ width: "16px", height: "16px", border: "2px solid #94a3b8", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                                            Loading revenue data...
                                        </div>
                                    </td>
                                </tr>
                            ) : revenueData.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: "48px 32px", textAlign: "center", color: "#94a3b8" }}>No program types found</td>
                                </tr>
                            ) : (
                                revenueData.map((row, index) => (
                                    <tr key={row.programTypeId} style={{ borderBottom: "1px solid #f8fafc" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc80")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                                        <td style={{ padding: "24px 32px", color: "#64748b", fontWeight: 500, fontSize: "14px" }}>{index + 1}</td>
                                        <td style={{ padding: "24px 32px", fontWeight: 700, color: "#334155", fontSize: "14px" }}>{row.programType}</td>
                                        <td style={{ padding: "24px 32px", fontWeight: 700, color: "#64748b", fontSize: "14px" }}>{formatCurrency(row.accessFee)}</td>
                                        <td style={{ padding: "24px 32px", fontWeight: 700, color: "#64748b", fontSize: "14px" }}>{formatCurrency(row.idCardFee)}</td>
                                        <td style={{ padding: "24px 32px", fontWeight: 700, color: "#64748b", fontSize: "14px" }}>{formatCurrency(row.transcriptFee)}</td>
                                        <td style={{ padding: "24px 32px", textAlign: "right" }}>
                                            <button
                                                onClick={() => onViewAllRevenue(row.programTypeId, row.programType)}
                                                style={{ color: "#1D7AD9", fontWeight: 700, fontSize: "12px", background: "none", border: "none", cursor: "pointer", textAlign: "right", lineHeight: 1.4 }}
                                            >
                                                View all<br />revenue
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
    );
};

export default PaymentsSummaryView;
