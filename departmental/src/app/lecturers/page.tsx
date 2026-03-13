import { useState, useEffect, useMemo, useRef } from "react";
import { Plus, FileUp, Filter, MoreHorizontal, UserCog, Pencil, Trash2, Download, X } from "lucide-react";
import { toaster } from "@components/ui/toaster";
import { exportToExcel } from "@utils/excel.util";
import { Box, Flex, Text, Input, Spinner } from "@chakra-ui/react";
import BulkUploadStaffModal from "@components/lecturers/BulkUploadStaffModal";
import AssignCourseModal from "@components/lecturers/AssignCourseModal";
import AddStaffForm from "@components/lecturers/AddStaffForm";
import { StaffServices } from "@services/staff.service";
import AssignStudentModal from "@components/lecturers/AssignStudentsModal";

interface Staff {
    id: string;
    staffNumber: string;
    fullName: string;
    email: string;
    phone?: string | null;
    department?: string;
    level?: string;
    courses?: string;
}

const ITEMS_PER_PAGE = 10;

const StaffPage = () => {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Action modals state
    const [showAssignCourse, setShowAssignCourse] = useState(false);
    const [showAddEditForm, setShowAddEditForm] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [staffToEdit, setStaffToEdit] = useState<any>(null);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const response = await StaffServices.getDepartmentLecturers();
            const data = response?.lecturers || response?.data || [];
            const mapped = data.map((item: any) => ({
                id: item.id,
                staffNumber: item.staffNumber || "N/A",
                fullName: item.user?.fullName || item.fullName || "N/A",
                email: item.user?.email || item.email || "N/A",
                phone: item.phone || item.user?.phone || "N/A",
                department: item.department?.name || "N/A",
                level: item.academicRank || "N/A",
                courses: item.courses?.map((course: any) => course.code).join(", ") || "N/A",
            }));
            setStaffList(mapped);
        } catch (err) {
            console.error("Failed to fetch staff", err);
            toaster.error({ title: "Failed to load lecturers" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = () => setActiveDropdownId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const filteredStaff = useMemo(() => {
        if (!searchQuery) return staffList;
        const q = searchQuery.toLowerCase();
        return staffList.filter(
            (s) => s.fullName.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.staffNumber?.toLowerCase().includes(q)
        );
    }, [staffList, searchQuery]);

    const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);
    const paginatedStaff = filteredStaff.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        const allIds = filteredStaff.map((s) => s.staffNumber);
        const allSelected = allIds.every((id) => selectedIds.includes(id));
        setSelectedIds(allSelected ? [] : allIds);
    };

    const toggleDropdown = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveDropdownId(activeDropdownId === id ? null : id);
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (window.confirm(`Delete ${selectedIds.length} selected lecturers?`)) {
            try {
                await StaffServices.bulkDeleteStaff(selectedIds);
                toaster.success({ title: `${selectedIds.length} lecturers deleted` });
                setSelectedIds([]);
                fetchStaff();
            } catch (err) {
                toaster.error({ title: "Failed to delete some lecturers" });
            }
        }
    };

    const handleDelete = async (staff: Staff) => {
        if (window.confirm(`Delete lecturer "${staff.fullName}"?`)) {
            try {
                await StaffServices.deleteLecturer(staff.id);
                toaster.success({ title: "Lecturer deleted" });
                fetchStaff();
            } catch (err) {
                toaster.error({ title: "Failed to delete lecturer" });
            }
        }
    };

    const handleAssignCourse = async (data: { courseId: string; role: string }) => {
        if (!selectedStaff) return;
        try {
            const payload = {
                courseAssignments: [{ courseId: data.courseId, role: data.role as "MAIN" | "ASSISTANT" | "LAB_ASSISTANT" }],
            };
            await StaffServices.assignCourses(selectedStaff.id, payload);
            toaster.success({ title: "Course assigned successfully" });
        } catch (err: any) {
            console.error("Failed to assign course:", err);
            toaster.error({ title: err.response?.data?.message || "Failed to assign course" });
            throw err;
        }
    };

    const handleAddEditSubmit = async (payload: any) => {
        try {
            if (staffToEdit) {
                await StaffServices.updateLecturer(staffToEdit.id, payload);
                toaster.success({ title: "Lecturer updated successfully" });
            } else {
                await StaffServices.addLecturer(payload);
                toaster.success({ title: "Lecturer added successfully" });
            }
            setShowAddEditForm(false);
            setStaffToEdit(null);
            fetchStaff();
        } catch (err: any) {
            console.error("Failed to save lecturer:", err);
            toaster.error({ title: err.response?.data?.message || "Failed to save lecturer" });
            throw err;
        }
    };

    return (
        <Box>
            <Flex justifyContent="space-between" alignItems="flex-start" mb="2">
                <Box>
                    <Text fontSize="2xl" fontWeight="bold" color="slate.800">Lecturers</Text>
                    <Text fontSize="sm" color="slate.500">Manage department lecturers and their roles</Text>
                </Box>
                <Flex gap="3">
                    <Box as="button" onClick={() => setShowUploadModal(true)} bg="white" border="1px solid" borderColor="blue.200" px="5" py="2.5" borderRadius="lg" fontSize="sm" fontWeight="semibold" color="blue.600" cursor="pointer" _hover={{ bg: "blue.50" }} display="flex" alignItems="center" gap="2">
                        <FileUp size={16} /> Upload CSV
                    </Box>
                    <Box as="button" onClick={() => { setStaffToEdit(null); setShowAddEditForm(true); }} bg="#1D7AD9" color="white" px="5" py="2.5" borderRadius="lg" fontSize="sm" fontWeight="bold" cursor="pointer" _hover={{ bg: "blue.700" }} border="none" display="flex" alignItems="center" gap="2">
                        <Plus size={16} /> Add Lecturer
                    </Box>
                </Flex>
            </Flex>

            {/* Search & Filter */}
            <Flex justifyContent="flex-end" gap="3" mb="6" mt="4">
                <Input placeholder="Search by name, email or code" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} bg="white" border="1px solid" borderColor="gray.200" borderRadius="xl" px="4" py="2.5" fontSize="xs" maxW="72" />
                <Box as="button" display="flex" alignItems="center" gap="2" px="4" py="2.5" bg="white" border="1px solid" borderColor="slate.200" borderRadius="xl" fontSize="xs" fontWeight="semibold" color="slate.600" cursor="pointer" _hover={{ bg: "slate.50" }}>
                    <Filter size={16} color="#94a3b8" /> Filter
                </Box>
            </Flex>

            {/* Table */}
            {loading ? (
                <Flex alignItems="center" justifyContent="center" minH="400px">
                    <Flex direction="column" alignItems="center" gap="4">
                        <Spinner size="xl" color="blue.500" borderWidth="3px" />
                        <Text color="slate.500">Loading lecturers...</Text>
                    </Flex>
                </Flex>
            ) : paginatedStaff.length === 0 ? (
                <Box textAlign="center" py="20" bg="slate.50" borderRadius="2xl" border="1px dashed" borderColor="slate.200">
                    <Text color="slate.500" fontWeight="medium">No lecturers found</Text>
                </Box>
            ) : (
                <Box bg="white" borderRadius="xl" border="1px solid" borderColor="gray.100" overflow="hidden" boxShadow="sm">
                    <Box overflowX="auto">
                        <Box as="table" w="full" fontSize="sm">
                            <Box as="thead" bg="slate.50">
                                <Box as="tr" borderBottom="1px solid" borderColor="slate.100">
                                    <Box as="th" px="6" py="5" w="12" textAlign="center">
                                        <input
                                            type="checkbox"
                                            checked={filteredStaff.length > 0 && selectedIds.length > 0 && filteredStaff.every((s) => selectedIds.includes(s.staffNumber))}
                                            onChange={toggleSelectAll}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </Box>
                                    <Box as="th" textAlign="left" px="6" py="5" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase" letterSpacing="wider">Staff ID</Box>
                                    <Box as="th" textAlign="left" px="6" py="5" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase" letterSpacing="wider">Name</Box>
                                    <Box as="th" textAlign="left" px="6" py="5" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase" letterSpacing="wider">Email</Box>
                                    <Box as="th" textAlign="left" px="6" py="5" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase" letterSpacing="wider">Phone No</Box>
                                    <Box as="th" textAlign="left" px="6" py="5" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase" letterSpacing="wider">Department</Box>
                                    <Box as="th" textAlign="left" px="6" py="5" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase" letterSpacing="wider">Rank</Box>
                                    <Box as="th" textAlign="left" px="6" py="5" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase" letterSpacing="wider">Course(s)</Box>
                                    <Box as="th" textAlign="center" px="6" py="5" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase" letterSpacing="wider">Action</Box>
                                </Box>
                            </Box>
                            <Box as="tbody">
                                {paginatedStaff.map((s) => (
                                    <Box as="tr" key={s.staffNumber} _hover={{ bg: "slate.50" }} borderBottom="1px solid" borderColor="gray.50" bg={selectedIds.includes(s.staffNumber) ? "blue.50" : undefined}>
                                        <Box as="td" px="6" py="5" textAlign="center">
                                            <input type="checkbox" checked={selectedIds.includes(s.staffNumber)} onChange={() => toggleSelection(s.staffNumber)} style={{ cursor: "pointer" }} />
                                        </Box>
                                        <Box as="td" px="6" py="5" fontSize="11px" color="slate.400" fontWeight="medium">{s.staffNumber}</Box>
                                        <Box as="td" px="6" py="5" fontSize="xs" fontWeight="bold" color="slate.700">{s.fullName}</Box>
                                        <Box as="td" px="6" py="5" fontSize="xs" color="slate.500">{s.email}</Box>
                                        <Box as="td" px="6" py="5" fontSize="xs" color="slate.500">{s.phone || "—"}</Box>
                                        <Box as="td" px="6" py="5" fontSize="xs" color="slate.500">{s.department}</Box>
                                        <Box as="td" px="6" py="5" fontSize="xs" color="slate.500">{s.level}</Box>
                                        <Box as="td" px="6" py="5">
                                            <Flex gap="1.5" wrap="wrap" maxW="160px">
                                                {s.courses?.split(", ").map((course, idx) => (
                                                    <Text key={idx} as="span" bg="#2ECC71" color="white" px="3" py="1" borderRadius="md" fontSize="10px" fontWeight="bold" boxShadow="sm" display="inline-block" textAlign="center" minW={course === "N/A" ? "60px" : "auto"}>
                                                        {course}
                                                    </Text>
                                                ))}
                                            </Flex>
                                        </Box>
                                        <Box as="td" px="6" py="5" textAlign="center" position="relative" ref={dropdownRef}>
                                            <Box as="button" onClick={(e: React.MouseEvent) => toggleDropdown(s.staffNumber, e)} p="1" _hover={{ bg: "slate.100" }} borderRadius="full" cursor="pointer" border="none" bg="transparent" color="slate.400">
                                                <MoreHorizontal size={20} />
                                            </Box>

                                            {activeDropdownId === s.staffNumber && (
                                                <Box position="absolute" right="0" top="10" w="48" bg="white" borderRadius="xl" boxShadow="xl" border="1px solid" borderColor="gray.100" zIndex="50" overflow="hidden" textAlign="left">
                                                    <Box p="1">
                                                        <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setSelectedStaff(s); setShowAssignCourse(true); setActiveDropdownId(null); }} w="full" display="flex" alignItems="center" gap="2" px="3" py="2" fontSize="sm" fontWeight="medium" color="green.600" _hover={{ bg: "green.50" }} borderRadius="lg" cursor="pointer" border="none" bg="transparent">
                                                            <UserCog size={16} /> Assign Course
                                                        </Box>
                                                        <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setStaffToEdit(s); setShowAddEditForm(true); setActiveDropdownId(null); }} w="full" display="flex" alignItems="center" gap="2" px="3" py="2" fontSize="sm" fontWeight="medium" color="amber.600" _hover={{ bg: "blackAlpha.50" }} borderRadius="lg" cursor="pointer" border="none" bg="transparent">
                                                            <Pencil size={16} /> Edit details
                                                        </Box>
                                                        <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleDelete(s); setActiveDropdownId(null); }} w="full" display="flex" alignItems="center" gap="2" px="3" py="2" fontSize="sm" fontWeight="medium" color="red.600" _hover={{ bg: "red.50" }} borderRadius="lg" cursor="pointer" border="none" bg="transparent">
                                                            <Trash2 size={16} /> Delete Lecturer
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Flex justifyContent="space-between" alignItems="center" px="4" py="3" borderTop="1px solid" borderColor="gray.100">
                            <Text fontSize="sm" color="slate.500">
                                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredStaff.length)} of {filteredStaff.length}
                            </Text>
                            <Flex gap="2">
                                <Flex as="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} px="3" py="1" borderRadius="md" border="1px solid" borderColor="gray.200" fontSize="sm" cursor="pointer" opacity={currentPage === 1 ? 0.5 : 1}>
                                    Previous
                                </Flex>
                                <Flex as="button" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} px="3" py="1" borderRadius="md" border="1px solid" borderColor="gray.200" fontSize="sm" cursor="pointer" opacity={currentPage === totalPages ? 0.5 : 1}>
                                    Next
                                </Flex>
                            </Flex>
                        </Flex>
                    )}
                </Box>
            )}

            {/* Floating Action Bar */}
            {selectedIds.length > 1 && (
                <Flex position="fixed" bottom="8" left="50%" transform="translateX(-50%)" bg="white" px="6" py="3" borderRadius="xl" boxShadow="2xl" border="1px solid" borderColor="gray.100" alignItems="center" gap="6" zIndex="50">
                    <Text fontSize="sm" fontWeight="bold" color="slate.700">{selectedIds.length} items selected</Text>
                    <Box w="px" h="6" bg="slate.200" />
                    <Box as="button" onClick={() => { exportToExcel(staffList.filter((s) => selectedIds.includes(s.staffNumber)).map((s) => ({ "Staff ID": s.staffNumber, Name: s.fullName, Email: s.email, Phone: s.phone || "N/A", Department: s.department, Level: s.level, Courses: s.courses })), "selected_lecturers", "Lecturers"); }} display="flex" alignItems="center" gap="2" bg="#1D7AD9" color="white" px="4" py="2" borderRadius="lg" fontSize="xs" fontWeight="bold" _hover={{ bg: "blue.700" }} cursor="pointer" border="none">
                        <Download size={16} /> Bulk Download
                    </Box>
                    <Box as="button" onClick={handleBulkDelete} display="flex" alignItems="center" gap="2" bg="red.500" color="white" px="4" py="2" borderRadius="lg" fontSize="xs" fontWeight="bold" _hover={{ bg: "red.600" }} cursor="pointer" border="none">
                        <Trash2 size={16} /> Bulk Delete
                    </Box>
                    <Box w="px" h="6" bg="slate.200" />
                    <Box as="button" onClick={() => setSelectedIds([])} p="1" _hover={{ bg: "slate.100" }} borderRadius="full" color="slate.400" cursor="pointer" border="none" bg="transparent" title="Unselect all">
                        <X size={20} />
                    </Box>
                </Flex>
            )}

            <BulkUploadStaffModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onUploaded={() => {
                    setShowUploadModal(false);
                    fetchStaff();
                }}
            />

            <AssignCourseModal
                isOpen={showAssignCourse}
                onClose={() => { setShowAssignCourse(false); setSelectedStaff(null); }}
                onAssign={handleAssignCourse}
                staffName={selectedStaff?.fullName}
            />

            <AddStaffForm
                isOpen={showAddEditForm}
                onClose={() => { setShowAddEditForm(false); setStaffToEdit(null); }}
                onSubmit={handleAddEditSubmit}
                initialData={staffToEdit}
            />

            
        </Box>
    );
};

export default StaffPage;
