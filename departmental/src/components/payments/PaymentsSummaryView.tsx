import { useState, useEffect } from "react";
import { Download, FileX } from "lucide-react";
import { PaymentServices } from "@services/payment.service";
import { toaster } from "@components/ui/toaster";
import { Box, Table, EmptyState, VStack } from "@chakra-ui/react";

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
    transcriptFee?: { total: string; count: number; amount: number; average: string | number };
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
                // 1. Get payment summary (access & ID card fees)
                const summaryResponse = await PaymentServices.getPaymentsSummary();
                if (!summaryResponse.success) {
                    toaster.error({ title: "Failed to load payment data" });
                    setLoading(false);
                    return;
                }

                const programTypes: Record<string, ProgramTypeSummary> = summaryResponse.data.summary.programTypes;
                const programTypeList = Object.values(programTypes);

                // 2. For each program type, fetch transcript applications and compute total fee
                const transcriptPromises = programTypeList.map(async (pt) => {
                    try {
                        const transcriptResponse = await PaymentServices.getTranscriptApplications(pt.id);
                        const apps = transcriptResponse?.data || [];
                        const total = apps.reduce((sum: number, app: any) => sum + parseFloat(app.feeAmount || "0"), 0);
                        return { programTypeId: pt.id, transcriptTotal: total };
                    } catch (error) {
                        console.error(`Failed to fetch transcript data for ${pt.name}:`, error);
                        return { programTypeId: pt.id, transcriptTotal: 0 };
                    }
                });

                const transcriptResults = await Promise.all(transcriptPromises);
                const transcriptMap = new Map(transcriptResults.map(r => [r.programTypeId, r.transcriptTotal]));

                // 3. Build revenue rows with transcript fee
                const rows: ProgramRevenue[] = programTypeList.map((pt) => ({
                    programTypeId: pt.id,
                    programType: pt.name,
                    accessFee: pt.accessFee?.amount ?? 0,
                    idCardFee: pt.idCardFee?.amount ?? 0,
                    transcriptFee: transcriptMap.get(pt.id) ?? 0,
                }));

                setRevenueData(rows);
            } catch (error) {
                console.error("Failed to load revenue summary:", error);
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
                <Box background="white" borderRadius="12px" boxShadow="0 1px 3px rgba(0,0,0,0.05)" border="1px solid #e2e8f0" overflowX="auto">
                    <Table.Root>
                        <Table.Header>
                            <Table.Row bg="#f8fafc">
                                <Table.ColumnHeader py="5" px="8" fontSize="xs" fontWeight="bold" color="slate.500" textTransform="uppercase" letterSpacing="widest" w="16">S/N</Table.ColumnHeader>
                                <Table.ColumnHeader py="5" px="8" fontSize="xs" fontWeight="bold" color="slate.500" textTransform="uppercase" letterSpacing="widest">Programme Type</Table.ColumnHeader>
                                <Table.ColumnHeader py="5" px="8" fontSize="xs" fontWeight="bold" color="slate.500" textTransform="uppercase" letterSpacing="widest">Access Fee</Table.ColumnHeader>
                                <Table.ColumnHeader py="5" px="8" fontSize="xs" fontWeight="bold" color="slate.500" textTransform="uppercase" letterSpacing="widest">ID Card Fee</Table.ColumnHeader>
                                <Table.ColumnHeader py="5" px="8" fontSize="xs" fontWeight="bold" color="slate.500" textTransform="uppercase" letterSpacing="widest">Transcript Fee</Table.ColumnHeader>
                                <Table.ColumnHeader py="5" px="8" fontSize="xs" fontWeight="bold" color="slate.500" textTransform="uppercase" letterSpacing="widest" textAlign="right">Revenue</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {loading ? (
                                <Table.Row>
                                    <Table.Cell colSpan={6} py="12" px="8" textAlign="center" color="slate.400">
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                                            <div style={{ width: "16px", height: "16px", border: "2px solid #94a3b8", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                                            Loading revenue data...
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ) : revenueData.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={6} py="12" px="8">
                                        <EmptyState.Root>
                                            <EmptyState.Content>
                                                <EmptyState.Indicator>
                                                    <FileX />
                                                </EmptyState.Indicator>
                                                <VStack textAlign="center">
                                                    <EmptyState.Title>No Payment Data Found</EmptyState.Title>
                                                    <EmptyState.Description>
                                                        There are currently no recorded payments for any programme type.
                                                    </EmptyState.Description>
                                                </VStack>
                                            </EmptyState.Content>
                                        </EmptyState.Root>
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                revenueData.map((row, index) => (
                                    <Table.Row key={row.programTypeId} _hover={{ bg: "slate.50" }} transition="background 0.2s">
                                        <Table.Cell py="6" px="8" color="slate.500" fontWeight="medium" fontSize="sm">{index + 1}</Table.Cell>
                                        <Table.Cell py="6" px="8" fontWeight="bold" color="slate.700" fontSize="sm">{row.programType}</Table.Cell>
                                        <Table.Cell py="6" px="8" fontWeight="bold" color="slate.500" fontSize="sm">{formatCurrency(row.accessFee)}</Table.Cell>
                                        <Table.Cell py="6" px="8" fontWeight="bold" color="slate.500" fontSize="sm">{formatCurrency(row.idCardFee)}</Table.Cell>
                                        <Table.Cell py="6" px="8" fontWeight="bold" color="slate.500" fontSize="sm">{formatCurrency(row.transcriptFee)}</Table.Cell>
                                        <Table.Cell py="6" px="8" textAlign="right">
                                            <button
                                                onClick={() => onViewAllRevenue(row.programTypeId, row.programType)}
                                                style={{ color: "#1D7AD9", fontWeight: 700, fontSize: "12px", background: "none", border: "none", cursor: "pointer", textAlign: "right", lineHeight: 1.4 }}
                                            >
                                                View all<br />revenue
                                            </button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            )}
                        </Table.Body>
                    </Table.Root>
                </Box>
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default PaymentsSummaryView;