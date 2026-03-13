import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router";
import { Download, Edit, Trash2, X } from "lucide-react";
import { AcademicServices } from "@services/academic.service";
import { toaster } from "@components/ui/toaster";
import { exportToExcel } from "@utils/excel.util";
import { Box, Flex, Text, Input, Spinner } from "@chakra-ui/react";

interface StructureTabProps {
    isCreatingRoute?: boolean;
    isEditingRoute?: boolean;
}

const StructureTab = ({ isCreatingRoute, isEditingRoute }: StructureTabProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const [sessions, setSessions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        semesters: "2",
        duration: "12 Months",
        startDate: "",
        description: "",
        isActive: true,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const sessionsData = await AcademicServices.getSessions();
                const list = Array.isArray(sessionsData) ? sessionsData : (sessionsData as any)?.data || (sessionsData as any)?.sessions || [];
                setSessions(list);
            } catch (err) {
                toaster.error({ title: "Failed to load sessions" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [location.pathname]);

    useEffect(() => {
        if (isEditingRoute && id && sessions.length > 0) {
            const sessionToEdit = sessions.find((s) => s.id === id);
            if (sessionToEdit) {
                setFormData({
                    name: sessionToEdit.name || "",
                    semesters: sessionToEdit.semesterCount?.toString() || "2",
                    duration: sessionToEdit.duration?.toString() || "12 Months",
                    startDate: sessionToEdit.startDate ? new Date(sessionToEdit.startDate).toISOString().split('T')[0] : "",
                    description: sessionToEdit.description || "",
                    isActive: sessionToEdit.isActive === undefined ? true : sessionToEdit.isActive,
                });
            }
        }
    }, [isEditingRoute, id, sessions]);

    const handleFormChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        setSelectedIds(selectedIds.length === sessions.length ? [] : sessions.map((s) => s.id));
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const durationInt = parseInt(formData.duration) || 12;
            const startDateObj = new Date(formData.startDate);
            const endDateObj = new Date(startDateObj);
            endDateObj.setMonth(startDateObj.getMonth() + durationInt);

            const payload = {
                name: formData.name,
                duration: durationInt,
                startDate: formData.startDate,
                endDate: endDateObj.toISOString().split("T")[0],
                semesterCount: Number(formData.semesters),
                description: formData.description,
                isActive: formData.isActive,
            };

            if (isEditingRoute && id) {
                await AcademicServices.updateSession(id, payload);
                toaster.success({ title: "Session updated successfully" });
            } else {
                await AcademicServices.createSession(payload);
                toaster.success({ title: "Session created successfully" });
            }

            const updated = await AcademicServices.getSessions();
            setSessions(Array.isArray(updated) ? updated : []);
            navigate("/program-courses");
        } catch (error: any) {
            toaster.error({ title: error.response?.data?.message || "Failed to save session" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this session?")) {
            try {
                await AcademicServices.deleteSession(id);
                toaster.success({ title: "Session deleted successfully" });
                const updated = await AcademicServices.getSessions();
                setSessions(Array.isArray(updated) ? updated : []);
            } catch (error: any) {
                toaster.error({ title: error.response?.data?.message || "Failed to delete session" });
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected sessions?`)) {
            try {
                await Promise.all(selectedIds.map((id) => AcademicServices.deleteSession(id)));
                toaster.success({ title: `${selectedIds.length} sessions deleted` });
                setSelectedIds([]);
                const updated = await AcademicServices.getSessions();
                setSessions(Array.isArray(updated) ? updated : []);
            } catch (err) {
                toaster.error({ title: "Failed to delete some sessions" });
            }
        }
    };

    const handleExport = () => {
        exportToExcel(sessions, "Academic_Sessions", "Sessions");
        toaster.success({ title: "Exported to Excel" });
    };

    const filteredSessions = sessions.filter((s) =>
        !searchTerm || s.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Create/Edit Form
    if (isCreatingRoute || isEditingRoute) {
        return (
            <Box bg="white" borderRadius="2xl" p="8" border="1px solid" borderColor="gray.100" boxShadow="sm">
                <Text fontSize="xl" fontWeight="bold" color="slate.800" mb="8">
                    {isEditingRoute ? "Edit Session" : "Create Session"}
                </Text>

                <Flex direction={{ base: "column", lg: "row" }} gap="8">
                    <Flex direction="column" gap="6" flex="1">
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Session Name</Text>
                            <Input value={formData.name} onChange={(e) => handleFormChange("name", e.target.value)} placeholder="e.g. 2024/2025 Academic Session" bg="slate.50" border="1px solid" borderColor="gray.200" borderRadius="lg" />
                        </Box>
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Semesters</Text>
                            <select value={formData.semesters} onChange={(e) => handleFormChange("semesters", e.target.value)} style={{ width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 12px", fontSize: "14px" }}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </Box>
                        <Box>
                            <Flex alignItems="center" gap="2">
                                <input 
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                />
                                <Text fontSize="sm" fontWeight="medium" color="slate.700" as="label" htmlFor="isActive">
                                    Activate Session
                                </Text>
                            </Flex>
                        </Box>
                    </Flex>
                    <Flex direction="column" gap="6" flex="1">
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Duration</Text>
                            <select value={formData.duration} onChange={(e) => handleFormChange("duration", e.target.value)} style={{ width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 12px", fontSize: "14px" }}>
                                <option>6 Months</option>
                                <option>12 Months</option>
                                <option>18 Months</option>
                            </select>
                        </Box>
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Start Date</Text>
                            <Input type="date" value={formData.startDate} onChange={(e) => handleFormChange("startDate", e.target.value)} bg="slate.50" border="1px solid" borderColor="gray.200" borderRadius="lg" />
                        </Box>
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Description</Text>
                            <textarea value={formData.description} onChange={(e) => handleFormChange("description", e.target.value)} rows={3} style={{ width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 12px", fontSize: "14px" }} />
                        </Box>
                    </Flex>
                </Flex>

                <Flex justifyContent="flex-end" gap="3" mt="8">
                    <Flex as="button" onClick={() => navigate("/program-courses")} px="8" py="2.5" borderRadius="lg" fontSize="sm" fontWeight="medium" border="1px solid" borderColor="slate.300" color="slate.600" _hover={{ bg: "slate.50" }} cursor="pointer" opacity={isSaving ? 0.5 : 1}>Cancel</Flex>
                    <Flex as="button" onClick={handleSave} px="8" py="2.5" borderRadius="lg" fontSize="sm" fontWeight="bold" bg="#00B01D" color="white" _hover={{ bg: "green.700" }} cursor="pointer" border="none" opacity={isSaving ? 0.5 : 1}>
                        {isSaving ? "Saving..." : isEditingRoute ? "Update Session" : "Create Session"}
                    </Flex>
                </Flex>
            </Box>
        );
    }

    // List View
    if (isLoading) {
        return (
            <Flex alignItems="center" justifyContent="center" minH="400px">
                <Flex direction="column" alignItems="center" gap="4">
                    <Spinner size="xl" color="blue.500" borderWidth="3px" />
                    <Text color="slate.500">Loading sessions...</Text>
                </Flex>
            </Flex>
        );
    }

    return (
        <Flex direction="column" gap="8">
            <Flex justifyContent="flex-end" gap="4">
                <Box as="button" onClick={handleExport} bg="white" color="blue.600" px="5" py="2.5" borderRadius="xl" display="flex" alignItems="center" gap="2" fontSize="sm" fontWeight="bold" boxShadow="lg" _hover={{ bg: "blue.50" }} border="none" cursor="pointer">
                    <Download size={18} /> Export table
                </Box>
                <Box as="button" onClick={() => navigate("/program-courses/sessions/new")} bg="blue.600" color="white" px="5" py="2.5" borderRadius="xl" display="flex" alignItems="center" gap="2" fontSize="sm" fontWeight="bold" boxShadow="lg" _hover={{ bg: "blue.700" }} border="none" cursor="pointer">
                    Create Session
                </Box>
            </Flex>

            <Box bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.100" boxShadow="sm">
                <Flex p="6" alignItems="center" justifyContent="space-between" gap="4">
                    <Text fontSize="lg" fontWeight="bold" color="slate.800">Created Sessions</Text>
                    <Input placeholder="Search sessions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} maxW="64" bg="white" border="1px solid" borderColor="slate.200" borderRadius="xl" fontSize="xs" px="4" py="2.5" />
                </Flex>

                <Box overflowX="auto">
                    <Box as="table" w="full" textAlign="left">
                        <Box as="thead">
                            <Box as="tr" bg="slate.50" borderY="1px solid" borderColor="gray.100">
                                <Box as="th" px="6" py="4" w="12" textAlign="center">
                                    <input type="checkbox" checked={sessions.length > 0 && selectedIds.length === sessions.length} onChange={toggleSelectAll} />
                                </Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase" letterSpacing="wider">Session Name</Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase" letterSpacing="wider">Duration</Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase" letterSpacing="wider">Start Date</Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase" letterSpacing="wider">Status</Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase" letterSpacing="wider" textAlign="center">Action</Box>
                            </Box>
                        </Box>
                        <Box as="tbody">
                            {filteredSessions.length === 0 ? (
                                <Box as="tr"><td colSpan={6} style={{ padding: "48px 0 0 24px", textAlign: "center", color: "#94a3b8" }}>No sessions found</td></Box>
                            ) : filteredSessions.map((session) => (
                                <Box as="tr" key={session.id} _hover={{ bg: "slate.50" }} borderBottom="1px solid" borderColor="gray.50" fontSize="sm" color="slate.600">
                                    <Box as="td" px="6" py="4" textAlign="center">
                                        <input type="checkbox" checked={selectedIds.includes(session.id)} onChange={() => toggleSelection(session.id)} />
                                    </Box>
                                    <Box as="td" px="6" py="4" fontWeight="medium">{session.name}</Box>
                                    <Box as="td" px="6" py="4">{session.duration}</Box>
                                    <Box as="td" px="6" py="4">{session.startDate}</Box>
                                    <Box as="td" px="6" py="4">
                                        <Text as="span" px="4" py="1" borderRadius="full" fontSize="11px" fontWeight="bold" bg={session.isActive ? "green.100" : "gray.100"} color={session.isActive ? "green.600" : "gray.600"}>
                                            {session.isActive ? "Active" : "Inactive"}
                                        </Text>
                                    </Box>
                                    <Box as="td" px="6" py="4" textAlign="center">
                                        <Flex justifyContent="center" gap="2">
                                            <Box as="button" onClick={() => navigate(`/program-courses/sessions/edit/${session.id}`)} p="1" _hover={{ bg: "slate.100" }} borderRadius="full" color="slate.400" cursor="pointer" border="none" bg="transparent">
                                                <Edit size={16} />
                                            </Box>
                                            <Box as="button" onClick={() => handleDelete(session.id)} p="1" _hover={{ bg: "red.50" }} borderRadius="full" color="red.400" cursor="pointer" border="none" bg="transparent">
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

            {selectedIds.length > 0 && (
                <Flex position="fixed" bottom="8" left="50%" transform="translateX(-50%)" bg="white" px="6" py="3" borderRadius="xl" boxShadow="2xl" border="1px solid" borderColor="gray.100" alignItems="center" gap="6" zIndex="50">
                    <Text fontSize="sm" fontWeight="bold" color="slate.700">{selectedIds.length} items selected</Text>
                    <Box w="px" h="6" bg="slate.200" />
                    <Box as="button" onClick={handleBulkDelete} display="flex" alignItems="center" gap="2" bg="red.500" color="white" px="4" py="2" borderRadius="lg" fontSize="xs" fontWeight="bold" _hover={{ bg: "red.600" }} cursor="pointer" border="none">
                        <Trash2 size={16} /> Delete
                    </Box>
                    <Box w="px" h="6" bg="slate.200" />
                    <Box as="button" onClick={() => setSelectedIds([])} p="1" _hover={{ bg: "slate.100" }} borderRadius="full" color="slate.400" cursor="pointer" border="none" bg="transparent">
                        <X size={20} />
                    </Box>
                </Flex>
            )}
        </Flex>
    );
};

export default StructureTab;