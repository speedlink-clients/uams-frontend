import { useState } from "react";
import { Plus, GraduationCap } from "lucide-react";
import { ProgramServices } from "@services/program.service";
import { toaster } from "@components/ui/toaster";
import { Box, Flex, Text, Input } from "@chakra-ui/react";

const AcademicSettingsTab = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({ name: "", code: "", type: "", description: "" });

    const handleCancel = () => {
        setFormData({ name: "", code: "", type: "", description: "" });
    };

    const handleSave = async () => {
        if (!formData.name || !formData.code) {
            toaster.error({ title: "Please fill in required fields (Name and Code)" });
            return;
        }
        try {
            setIsSaving(true);
            await ProgramServices.createProgramType({ ...formData, type: formData.type.toUpperCase() });
            toaster.success({ title: "Program Type created successfully" });
            handleCancel();
        } catch (error: any) {
            toaster.error({ title: error.response?.data?.message || "Failed to create program type" });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Flex direction="column" gap="8">
            <Box bg="white" borderRadius="2xl" border="xs" borderColor="border.muted" overflow="hidden">
                <Flex p="6" borderBottom="xs" borderColor="border.muted" alignItems="center" gap="3">
                    <Flex bg="blue.50" p="2" borderRadius="lg"><GraduationCap size={20} color="#2563eb" /></Flex>
                    <Box>
                        <Text fontSize="lg" fontWeight="bold" color="slate.800">Create Program Type</Text>
                        <Text fontSize="sm" color="slate.500">Add a new program type to the system (e.g., Bachelor of Science, Master of Arts)</Text>
                    </Box>
                </Flex>

                <Box p="8">
                    <Flex direction={{ base: "column", lg: "row" }} gap="8">
                        <Flex direction="column" gap="6" flex="1">
                            <Box>
                                <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Name</Text>
                                <Input value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Bachelor of Science" bg="slate.50" border="xs" borderColor="border.muted" borderRadius="lg" />
                            </Box>
                            <Box>
                                <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Code</Text>
                                <Input value={formData.code} onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))} placeholder="e.g. BSC" bg="slate.50" border="xs" borderColor="border.muted" borderRadius="lg" />
                            </Box>
                        </Flex>
                        <Flex direction="column" gap="6" flex="1">
                            <Box>
                                <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Type</Text>
                                <Input value={formData.type} onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))} placeholder="e.g. UNDERGRADUATE, POST-GRADUATE" bg="slate.50" border="xs" borderColor="border.muted" borderRadius="lg" />
                            </Box>
                            <Box>
                                <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Description</Text>
                                <textarea value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} rows={3} style={{ width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 12px", fontSize: "14px" }} placeholder="Optional description" />
                            </Box>
                        </Flex>
                    </Flex>

                    <Flex wrap="wrap" justifyContent="flex-end" gap="3" mt="8">
                        <Box as="button" onClick={handleCancel} px="8" py="2.5" borderRadius="lg" fontSize="sm" fontWeight="medium" border="xs" borderColor="border.muted" color="slate.600" cursor="pointer" _hover={{ bg: "slate.50" }}>Clear</Box>
                        <Flex as="button" onClick={handleSave} px="8" py="2.5" borderRadius="lg" fontSize="sm" fontWeight="bold" bg="#00B01D" color="white" cursor="pointer" border="none" _hover={{ bg: "green.700" }} display="flex" alignItems="center" gap="2" opacity={isSaving ? 0.5 : 1}>
                            {isSaving ? "Creating..." : <><Plus size={16} /> Create Program Type</>}
                        </Flex>
                    </Flex>
                </Box>
            </Box>

            {/* Info Note */}
            <Flex bg="blue.50" border="xs" borderColor="blue.100" borderRadius="xl" p="4" alignItems="flex-start" gap="3">
                <Flex bg="blue.100" p="1.5" borderRadius="full" mt="0.5"><GraduationCap size={14} color="#2563eb" /></Flex>
                <Box>
                    <Text fontSize="sm" fontWeight="medium" color="blue.800">Note</Text>
                    <Text fontSize="sm" color="blue.700">
                        Program types are typically created once during initial setup. To view and manage existing program types, go to <Text as="span" fontWeight="semibold">Programs & Courses → Program Types</Text>.
                    </Text>
                </Box>
            </Flex>
        </Flex>
    );
};

export default AcademicSettingsTab;
