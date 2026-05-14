import { useState, useEffect } from "react";
import { Download, FileX } from "lucide-react";
import { PaymentServices } from "@services/payment.service";
import { toaster } from "@components/ui/toaster";
import { 
    Box, 
    Table, 
    EmptyState, 
    VStack, 
    Flex, 
    Heading, 
    Button, 
    Spinner, 
    Text 
} from "@chakra-ui/react";

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
                const summaryResponse = await PaymentServices.getPaymentsSummary();
                if (!summaryResponse.success) {
                    toaster.error({ title: "Failed to load payment data" });
                    setLoading(false);
                    return;
                }

                const programTypes: Record<string, ProgramTypeSummary> = summaryResponse.data.summary.programTypes;
                const programTypeList = Object.values(programTypes);

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
        <Box minH="100vh" bg="slate.50" p="4">
            <Box maxW="1400px" mx="auto">
                {/* Header */}
                <Flex justifyContent="space-between" alignItems="center" mb="8" wrap="wrap" gap="4">
                    <Heading size="lg" fontWeight="bold" color="fg.muted">Payments History</Heading>
                    <Button bg="#1D7AD9" color="white" borderRadius="md" fontWeight="bold" fontSize="sm" _hover={{ bg: "blue.600" }} px="5" py="2.5">
                        <Download size={18} /> Export
                    </Button>
                </Flex>

                {/* Table Container */}
                <Box bg="white" borderRadius="md" border="xs" borderColor="border.muted" overflowX="auto" boxShadow="none">
                    <Table.Root>
                        <Table.Header>
                            <Table.Row bg="slate.50" borderBottom="xs" borderColor="border.muted">
                                <Table.ColumnHeader py="4" px="6" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" w="16">S/N</Table.ColumnHeader>
                                <Table.ColumnHeader py="4" px="6" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">Programme Type</Table.ColumnHeader>
                                <Table.ColumnHeader py="4" px="6" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">Access Fee</Table.ColumnHeader>
                                <Table.ColumnHeader py="4" px="6" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">ID Card Fee</Table.ColumnHeader>
                                <Table.ColumnHeader py="4" px="6" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">Transcript Fee</Table.ColumnHeader>
                                <Table.ColumnHeader py="4" px="6" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" textAlign="right">Revenue</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {loading ? (
                                <Table.Row>
                                    <Table.Cell colSpan={6} py="12" textAlign="center">
                                        <Flex direction="column" alignItems="center" gap="3">
                                            <Spinner size="lg" color="blue.500" />
                                            <Text color="fg.muted" fontSize="sm">Loading revenue data...</Text>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                            ) : revenueData.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={6} py="12">
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
                                    <Table.Row key={row.programTypeId} _hover={{ bg: "slate.50" }} borderBottom="xs" borderColor="border.muted">
                                        <Table.Cell py="4" px="6" color="fg.muted" fontWeight="medium" fontSize="sm">{index + 1}</Table.Cell>
                                        <Table.Cell py="4" px="6" fontWeight="bold" color="fg.muted" fontSize="sm">{row.programType}</Table.Cell>
                                        <Table.Cell py="4" px="6" fontWeight="bold" color="fg.muted" fontSize="sm">{formatCurrency(row.accessFee)}</Table.Cell>
                                        <Table.Cell py="4" px="6" fontWeight="bold" color="fg.muted" fontSize="sm">{formatCurrency(row.idCardFee)}</Table.Cell>
                                        <Table.Cell py="4" px="6" fontWeight="bold" color="fg.muted" fontSize="sm">{formatCurrency(row.transcriptFee)}</Table.Cell>
                                        <Table.Cell py="4" px="6" textAlign="right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                color="#1D7AD9"
                                                fontWeight="bold"
                                                fontSize="xs"
                                                onClick={() => onViewAllRevenue(row.programTypeId, row.programType)}
                                                h="auto"
                                                py="1"
                                                textAlign="right"
                                            >
                                                View all<br />revenue
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            )}
                        </Table.Body>
                    </Table.Root>
                </Box>
            </Box>
        </Box>
    );
};

export default PaymentsSummaryView;