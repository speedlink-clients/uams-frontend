import { UserSquare, CreditCard, Settings2 } from "lucide-react";
import { Box, Tabs } from "@chakra-ui/react";
import IDCardSettingsTab from "@components/settings/IDCardSettingsTab";
import PaymentSettingsTab from "@components/settings/PaymentSettingsTab";
import SystemSettingsTab from "@components/settings/SystemSettingsTab";

const SettingsPage = () => {
    return (
        <Box maxW="1200px" mx="auto">
            <Tabs.Root defaultValue="id-card" variant="plain">
                <Tabs.List bg="slate.50" p="1.5" borderRadius="lg" border="xs" borderColor="border.muted" mb="8" overflowX="auto" display="flex" gap="2">
                    <Tabs.Trigger 
                        value="id-card" 
                        color="slate.500" 
                        fontWeight="bold" 
                        borderRadius="md" 
                        px="4" 
                        py="2.5" 
                        gap="2"
                        _selected={{ bg: "white", color: "#1D7AD9", shadow: "sm", border: "1px solid", borderColor: "slate.200" }}
                        _hover={{ color: "slate.700", bg: "slate.100", _selected: { color: "#1D7AD9", bg: "white" } }}
                        transition="all 0.2s"
                        border="1px solid transparent"
                    >
                        <UserSquare size={16} /> ID Card
                    </Tabs.Trigger>
                    
                    <Tabs.Trigger 
                        value="payment" 
                        color="slate.500" 
                        fontWeight="bold" 
                        borderRadius="md" 
                        px="4" 
                        py="2.5" 
                        gap="2"
                        _selected={{ bg: "white", color: "#1D7AD9", shadow: "sm", border: "1px solid", borderColor: "slate.200" }}
                        _hover={{ color: "slate.700", bg: "slate.100", _selected: { color: "#1D7AD9", bg: "white" } }}
                        transition="all 0.2s"
                        border="1px solid transparent"
                    >
                        <CreditCard size={16} /> Payment
                    </Tabs.Trigger>

                    <Tabs.Trigger 
                        value="system" 
                        color="slate.500" 
                        fontWeight="bold" 
                        borderRadius="md" 
                        px="4" 
                        py="2.5" 
                        gap="2"
                        _selected={{ bg: "white", color: "#1D7AD9", shadow: "sm", border: "1px solid", borderColor: "slate.200" }}
                        _hover={{ color: "slate.700", bg: "slate.100", _selected: { color: "#1D7AD9", bg: "white" } }}
                        transition="all 0.2s"
                        border="1px solid transparent"
                    >
                        <Settings2 size={16} /> System
                    </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="id-card" p={0}>
                    <IDCardSettingsTab />
                </Tabs.Content>
                <Tabs.Content value="payment" p={0}>
                    <PaymentSettingsTab />
                </Tabs.Content>
                <Tabs.Content value="system" p={0}>
                    <SystemSettingsTab />
                </Tabs.Content>
            </Tabs.Root>
        </Box>
    );
};

export default SettingsPage;
