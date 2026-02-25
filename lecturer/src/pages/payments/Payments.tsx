import { useState } from "react";
import PaymentsSummaryView from "@components/shared/PaymentsSummaryView";
import TransactionsList from "@components/shared/TransactionsList";

const Payments = () => {
    const [view, setView] = useState<"summary" | "transactions">("summary");
    const [selectedProgramTypeId, setSelectedProgramTypeId] = useState<string | null>(null);
    const [selectedProgramTypeName, setSelectedProgramTypeName] = useState("");

    const handleViewAllRevenue = (programTypeId: string, programTypeName: string) => {
        setSelectedProgramTypeId(programTypeId);
        setSelectedProgramTypeName(programTypeName);
        setView("transactions");
    };

    const handleBackToSummary = () => {
        setView("summary");
        setSelectedProgramTypeId(null);
        setSelectedProgramTypeName("");
    };

    if (view === "transactions") {
        return (
            <TransactionsList
                onBack={handleBackToSummary}
                programTypeId={selectedProgramTypeId}
                programTypeName={selectedProgramTypeName}
            />
        );
    }

    return <PaymentsSummaryView onViewAllRevenue={handleViewAllRevenue} />;
};

export default Payments;
