import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { ProgramServices } from "@services/program.service";
import { AcademicServices } from "@services/academic.service";
import { toaster } from "@components/ui/toaster";
import { Box, Flex, Text, Spinner, Button } from "@chakra-ui/react";

const CreditLimitTab = () => {
    const [creditLimits, setCreditLimits] = useState<any[]>([]);
    const [programs, setPrograms] = useState<any[]>([]);
    const [levels, setLevels] = useState<any[]>([]);
    const [sessions, setSessions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        programId: "",
        levelId: "",
        sessionId: "",
        maxCreditLoad: 24,
    });

    useEffect(() => {
        fetchCreditLimits();
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (formData.programId) {
            AcademicServices.getLevels(formData.programId)
                .then(setLevels)
                .catch(() => setLevels([]));
        } else {
            setLevels([]);
        }
    }, [formData.programId]);

    const fetchCreditLimits = async () => {
        try {
            setIsLoading(true);
            const data = await ProgramServices.getCreditLimits();
            setCreditLimits(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch credit limits:", err);
            setCreditLimits([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchInitialData = async () => {
        try {
            const [programsData, sessionsData] = await Promise.all([
                ProgramServices.getProgramsByDepartment(),
                AcademicServices.getSessions(),
            ]);
            const progList = Array.isArray(programsData)
                ? programsData
                : (programsData as any)?.data || (programsData as any)?.programs || [];
            setPrograms(progList);
            setSessions(Array.isArray(sessionsData) ? sessionsData : []);
        } catch (err) {
            console.error("Failed to fetch initial data:", err);
        }
    };

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        setSelectedIds(
            selectedIds.length === creditLimits.length
                ? []
                : creditLimits.map((cl) => cl.id)
        );
    };

    const handleSave = async () => {
        if (!formData.levelId || !formData.sessionId) {
            toaster.error({ title: "Please select level and session" });
            return;
        }
        try {
            setIsSaving(true);
            const payload = {
                levelId: formData.levelId,
                sessionId: formData.sessionId,
                maxCreditLoad: Number(formData.maxCreditLoad),
            };
            if (editingId) {
                await ProgramServices.updateCreditLimit(editingId, payload);
                toaster.success({ title: "Credit limit updated" });
            } else {
                await ProgramServices.createCreditLimit(payload);
                toaster.success({ title: "Credit limit created" });
            }
            setIsFormOpen(false);
            setEditingId(null);
            setFormData({ programId: "", levelId: "", sessionId: "", maxCreditLoad: 24 });
            fetchCreditLimits();
        } catch (err: any) {
            toaster.error({ title: err.response?.data?.message || "Failed to save credit limit" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this credit limit?")) {
            try {
                await ProgramServices.deleteCreditLimit(id);
                toaster.success({ title: "Credit limit deleted" });
                fetchCreditLimits();
            } catch (err) {
                toaster.error({ title: "Failed to delete credit limit" });
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (window.confirm(`Delete ${selectedIds.length} selected credit limits?`)) {
            try {
                await Promise.all(selectedIds.map((id) => ProgramServices.deleteCreditLimit(id)));
                toaster.success({ title: `${selectedIds.length} credit limits deleted` });
                setSelectedIds([]);
                fetchCreditLimits();
            } catch (err) {
                toaster.error({ title: "Failed to delete some credit limits" });
            }
        }
    };

    const handleCancelForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ programId: "", levelId: "", sessionId: "", maxCreditLoad: 24 });
    };

    if (isLoading) {
        return (
            <Flex alignItems="center" justifyContent="center" minH="400px">
                <Flex direction="column" alignItems="center" gap="4">
                    <Spinner size="xl" color="blue.500" borderWidth="3px" />
                    <Text color="slate.500">Loading credit limits...</Text>
                </Flex>
            </Flex>
        );
    }

    return (
        <Flex direction="column" gap="8">
            <Box bg="white" borderRadius="2xl" border="xs" borderColor="border.muted" boxShadow="sm">
                <Flex p="6" alignItems="center" justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold" color="slate.800">
                        Credit Limits ({creditLimits.length})
                    </Text>
                    <Flex gap="3">
                        {selectedIds.length > 0 && (
                            <Box
                                as="button" onClick={handleBulkDelete}
                                display="flex" alignItems="center" gap="2"
                                bg="red.500" color="white" px="4" py="2"
                                borderRadius="xl" fontSize="sm" fontWeight="bold"
                                _hover={{ bg: "red.600" }} cursor="pointer" border="none"
                            >
                                <Trash2 size={16} /> Delete ({selectedIds.length})
                            </Box>
                        )}
                        <Button
                            onClick={() => setIsFormOpen(true)}
                            display="flex" alignItems="center" gap="2"
                            bg="blue.600" color="white" px="4" py="2"
                            borderRadius="xl" fontSize="sm" fontWeight="bold"
                            _hover={{ bg: "blue.700" }} cursor="pointer" border="none"
                        >
                            <Plus size={16} /> Create Credit Limit
                        </Button>
                    </Flex>
                </Flex>

                {/* Inline Form */}
                {isFormOpen && (
                    <Box px="6" pb="6">
                        <Box bg="slate.50" borderRadius="xl" p="6" border="xs" borderColor="border.muted">
                            <Text fontSize="md" fontWeight="semibold" color="slate.700" mb="4">
                                {editingId ? "Edit Credit Limit" : "New Credit Limit"}
                            </Text>
                            <Flex gap="4" direction={{ base: "column", md: "row" }}>
                                <Box flex="1">
                                    <Text fontSize="sm" fontWeight="medium" color="gray.700" mb="1">Program</Text>
                                    <select
                                        value={formData.programId}
                                        onChange={(e) => setFormData({ ...formData, programId: e.target.value, levelId: "" })}
                                        style={{ width: "100%", borderRadius: "6px", border: "1px solid #d1d5db", padding: "8px 12px", background: "white", fontSize: "14px" }}
                                    >
                                        <option value="">Select Program</option>
                                        {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </Box>
                                <Box flex="1">
                                    <Text fontSize="sm" fontWeight="medium" color="gray.700" mb="1">Level</Text>
                                    <select
                                        value={formData.levelId}
                                        onChange={(e) => setFormData({ ...formData, levelId: e.target.value })}
                                        disabled={!formData.programId}
                                        style={{ width: "100%", borderRadius: "6px", border: "1px solid #d1d5db", padding: "8px 12px", background: formData.programId ? "white" : "#f1f5f9", fontSize: "14px" }}
                                    >
                                        <option value="">Select Level</option>
                                        {levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                                    </select>
                                </Box>
                                <Box flex="1">
                                    <Text fontSize="sm" fontWeight="medium" color="gray.700" mb="1">Session</Text>
                                    <select
                                        value={formData.sessionId}
                                        onChange={(e) => setFormData({ ...formData, sessionId: e.target.value })}
                                        style={{ width: "100%", borderRadius: "6px", border: "1px solid #d1d5db", padding: "8px 12px", background: "white", fontSize: "14px" }}
                                    >
                                        <option value="">Select Session</option>
                                        {sessions.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </Box>
                                <Box flex="1">
                                    <Text fontSize="sm" fontWeight="medium" color="gray.700" mb="1">Credit Load</Text>
                                    <input
                                        type="number"
                                        value={formData.maxCreditLoad}
                                        onChange={(e) => setFormData({ ...formData, maxCreditLoad: Number(e.target.value) })}
                                        min={1}
                                        style={{ width: "100%", borderRadius: "6px", border: "1px solid #d1d5db", padding: "8px 12px", background: "white", fontSize: "14px" }}
                                    />
                                </Box>
                            </Flex>
                            <Flex justifyContent="flex-end" gap="3" mt="4">
                                <Button
                                    onClick={handleCancelForm}
                                    px="4" py="2" borderRadius="md"
                                    border="xs" borderColor="border.muted"
                                    color="gray.700" cursor="pointer" fontSize="sm"
                                    _hover={{ bg: "gray.50" }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    px="4" py="2" borderRadius="md"
                                    bg="green.600" color="white" cursor="pointer"
                                    fontSize="sm" fontWeight="bold" border="none"
                                    _hover={{ bg: "green.700" }}
                                    opacity={isSaving ? 0.5 : 1}
                                    alignItems="center" gap="2"
                                >
                                    {isSaving ? "Saving..." : editingId ? "Update" : "Create"}
                                </Button>
                            </Flex>
                        </Box>
                    </Box>
                )}

                {/* Table */}
                <Box overflowX="auto">
                    <Box as="table" w="full" textAlign="left">
                        <Box as="thead">
                            <Box as="tr" bg="slate.50" borderY="1px solid" borderColor="border.muted">
                                <Box as="th" px="6" py="4" w="12" textAlign="center">
                                    <input type="checkbox" checked={creditLimits.length > 0 && selectedIds.length === creditLimits.length} onChange={toggleSelectAll} style={{ cursor: "pointer" }} />
                                </Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase">Level</Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase">Session</Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase">Status</Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase">Credit Load</Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase">Actions</Box>
                            </Box>
                        </Box>
                        <Box as="tbody">
                            {creditLimits.length === 0 ? (
                                <Box as="tr">
                                    <td colSpan={6} style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8" }}>No credit limits found</td>
                                </Box>
                            ) : creditLimits.map((cl) => (
                                <Box
                                    as="tr" key={cl.id}
                                    _hover={{ bg: "slate.50" }}
                                    borderBottom="xs" borderColor="border.muted"
                                    fontSize="sm" color="slate.600"
                                    bg={selectedIds.includes(cl.id) ? "blue.50" : undefined}
                                >
                                    <Box as="td" px="6" py="4" textAlign="center">
                                        <input type="checkbox" checked={selectedIds.includes(cl.id)} onChange={() => toggleSelection(cl.id)} style={{ cursor: "pointer" }} />
                                    </Box>
                                    <Box as="td" px="6" py="4">{cl.level?.name || cl.levelId}</Box>
                                    <Box as="td" px="6" py="4">{cl.session?.name || cl.sessionId}</Box>
                                    <Box as="td" px="6" py="4">
                                        <Text
                                            as="span" px="3" py="1" borderRadius="full"
                                            fontSize="11px" fontWeight="bold"
                                            bg={cl.session?.isActive ? "green.100" : "gray.100"}
                                            color={cl.session?.isActive ? "green.600" : "gray.600"}
                                        >
                                            {cl.session?.isActive ? "Active" : "Inactive"}
                                        </Text>
                                    </Box>
                                    <Box as="td" px="6" py="4">{cl.maxCreditLoad}</Box>
                                    <Box as="td" px="6" py="4">
                                        <Flex alignItems="center" gap="2">
                                            <Box
                                                as="button"
                                                onClick={() => {
                                                    setFormData({
                                                        programId: cl.programId || "",
                                                        levelId: cl.levelId || "",
                                                        sessionId: cl.sessionId || "",
                                                        maxCreditLoad: cl.maxCreditLoad || 24,
                                                    });
                                                    setEditingId(cl.id);
                                                    setIsFormOpen(true);
                                                }}
                                                p="1" _hover={{ bg: "amber.50" }} borderRadius="md"
                                                color="amber.500" cursor="pointer" border="none" bg="transparent"
                                            >
                                                <Edit size={16} />
                                            </Box>
                                            <Box
                                                as="button" onClick={() => handleDelete(cl.id)}
                                                p="1" _hover={{ bg: "red.50" }} borderRadius="md"
                                                color="red.500" cursor="pointer" border="none" bg="transparent"
                                            >
                                                <Trash2 size={16} />
                                            </Box>
                                        </Flex>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Floating Action Bar */}
            {selectedIds.length > 0 && (
                <Flex position="fixed" bottom="8" left="50%" transform="translateX(-50%)" bg="white" px="6" py="3" borderRadius="xl" boxShadow="2xl" border="xs" borderColor="border.muted" alignItems="center" gap="6" zIndex="50">
                    <Text fontSize="sm" fontWeight="bold" color="slate.700">{selectedIds.length} items selected</Text>
                    <Box w="px" h="6" bg="slate.200" />
                    <Button onClick={handleBulkDelete} display="flex" alignItems="center" gap="2" bg="red.500" color="white" px="4" py="2" borderRadius="lg" fontSize="xs" fontWeight="bold" _hover={{ bg: "red.600" }} cursor="pointer" border="none">
                        <Trash2 size={16} /> Delete
                    </Button>
                    <Box w="px" h="6" bg="slate.200" />
                    <Button onClick={() => setSelectedIds([])} p="1" _hover={{ bg: "slate.100" }} borderRadius="full" color="slate.400" cursor="pointer" border="none" bg="transparent">
                        <X size={20} />
                    </Button>
                </Flex>
            )}
        </Flex>
    );
};

export default CreditLimitTab;