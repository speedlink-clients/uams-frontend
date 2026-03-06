import { useState } from "react";
import { UserSquare, CreditCard, GraduationCap } from "lucide-react";
import { Box, Flex } from "@chakra-ui/react";
import IDCardSettingsTab from "@components/settings/IDCardSettingsTab";
import PaymentSettingsTab from "@components/settings/PaymentSettingsTab";
import AcademicSettingsTab from "@components/settings/AcademicSettingsTab";

type SettingsTab = "ID Card" | "Payment" | "Academic";

const TabButton = ({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) => (
    <Box
        as="button"
        onClick={onClick}
        display="flex"
        alignItems="center"
        gap="2"
        px="4"
        py="2.5"
        borderRadius="md"
        fontSize="sm"
        fontWeight="bold"
        transition="all 0.2s"
        whiteSpace="nowrap"
        bg={active ? "white" : "transparent"}
        color={active ? "#1D7AD9" : "slate.500"}
        boxShadow={active ? "sm" : "none"}
        border={active ? "1px solid" : "1px solid transparent"}
        borderColor={active ? "slate.200" : "transparent"}
        cursor="pointer"
        _hover={{ color: active ? "#1D7AD9" : "slate.700", bg: active ? "white" : "slate.100" }}
    >
        {icon}
        {label}
    </Box>
);

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>("ID Card");

    return (
        <Box maxW="1200px" mx="auto">
            {/* Tabs */}
            <Flex bg="slate.50" p="1.5" borderRadius="lg" alignItems="center" gap="2" overflowX="auto" mb="8" border="1px solid" borderColor="slate.200">
                <TabButton active={activeTab === "ID Card"} onClick={() => setActiveTab("ID Card")} icon={<UserSquare size={16} />} label="ID Card" />
                <TabButton active={activeTab === "Payment"} onClick={() => setActiveTab("Payment")} icon={<CreditCard size={16} />} label="Payment" />
                <TabButton active={activeTab === "Academic"} onClick={() => setActiveTab("Academic")} icon={<GraduationCap size={16} />} label="Academic" />
            </Flex>

            {/* Content */}
            {activeTab === "ID Card" && <IDCardSettingsTab />}
            {activeTab === "Payment" && <PaymentSettingsTab />}
            {activeTab === "Academic" && <AcademicSettingsTab />}
        </Box>
    );
};

export default SettingsPage;
