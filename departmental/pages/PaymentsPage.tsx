import { useState } from "react";
import { PaymentsSummaryView } from "../components/payments/PaymentsSummaryView";
import TransactionsList from "../components/payments/TransactionsList";

type ViewState = "summary" | "transactions";

export default function PaymentsPage() {
  const [currentView, setCurrentView] = useState<ViewState>("summary");
  const [selectedProgramTypeId, setSelectedProgramTypeId] = useState<string | null>(null);
  const [selectedProgramTypeName, setSelectedProgramTypeName] = useState<string>("");

  const handleViewAllRevenue = (programTypeId: string, programTypeName: string) => {
    setSelectedProgramTypeId(programTypeId);
    setSelectedProgramTypeName(programTypeName);
    setCurrentView("transactions");
  };

  const handleBackToSummary = () => {
    setCurrentView("summary");
    setSelectedProgramTypeId(null);
    setSelectedProgramTypeName("");
  };

  return (
    <div>
      {currentView === "summary" ? (
        <PaymentsSummaryView onViewAllRevenue={handleViewAllRevenue} />
      ) : (
        <TransactionsList 
          onBack={handleBackToSummary} 
          programTypeId={selectedProgramTypeId}
          programTypeName={selectedProgramTypeName}
        />
      )}
    </div>
  );
}
