import { useState, useEffect, useMemo, useRef } from "react";
import { Plus, FileDown, FileUp, MoreHorizontal, UserCog, Pencil, Trash2, Download, X, Search } from "lucide-react";
import { toaster } from "@components/ui/toaster";
import { exportToExcel } from "@utils/excel.util";
import { Box, Flex, Text, Spinner } from "@chakra-ui/react";
import BulkUploadStudentsModal from "@components/students/BulkUploadStudentsModal";
import StudentDetailsSidebar from "@components/students/StudentDetailsSidebar";
import AddStudentForm from "@components/students/AddStudentForm";
import DeleteConfirmationModal from "@components/students/DeleteConfirmationModal";
import { StudentServices } from "@services/student.service";

interface Student {
    id: string;
    regNo: string;
    matNo: string;
    surname: string;
    otherNames: string;
    fullName: string;
    email: string;
    phoneNo: string;
    sex: string;
    admissionMode: string;
    entryQualification: string;
    faculty: string;
    department: string;
    level: string;
    degreeCourse: string;
    programDuration: string;
    degreeAwardCode: string;
    isActive: boolean;
    createdAt: string;
}

const ITEMS_PER_PAGE = 10;

const StudentsPage = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showUpload, setShowUpload] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState("all");
    const [selectedProgram, setSelectedProgram] = useState("all");
    const [selectedSession, setSelectedSession] = useState("all");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const apiStudents = await StudentServices.getDepartmentStudents();
            const studentArray = Array.isArray(apiStudents) ? apiStudents : (apiStudents?.data || apiStudents?.users || []);
            const mapped: Student[] = studentArray.map((s: any) => ({
                id: s.id || s.userId,
                regNo: s.registrationNo || "N/A",
                matNo: s.studentId || "N/A",
                surname: s.user?.fullName?.split(" ")[0] || "N/A",
                otherNames: s.user?.fullName?.split(" ").slice(1).join(" ") || "N/A",
                fullName: s.user?.fullName || s.fullName || "N/A",
                email: s.user?.email || s.email || "N/A",
                phoneNo: s.user?.phone || s.phone || "N/A",
                sex: s.gender || "N/A",
                admissionMode: s.admissionMode || "N/A",
                entryQualification: s.entryQualification || "N/A",
                faculty: s.Department?.Faculty?.name || "N/A",
                department: s.Department?.name || "N/A",
                level: s.Level?.name || s.level || "N/A",
                degreeCourse: s.degreeCourse || "N/A",
                programDuration: s.courseDuration || "N/A",
                degreeAwardCode: s.degreeAwarded || "N/A",
                isActive: s.isActive ?? true,
                createdAt: s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A",
            }));
            setStudents(mapped);
        } catch (err) {
            console.error("Failed to fetch students", err);
            toaster.error({ title: "Failed to load students" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        const handleClickOutside = () => setActiveDropdownId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const filteredStudents = useMemo(() => {
        let filtered = students;

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (s) =>
                    s.fullName.toLowerCase().includes(q) ||
                    s.surname.toLowerCase().includes(q) ||
                    s.otherNames.toLowerCase().includes(q) ||
                    s.email.toLowerCase().includes(q) ||
                    s.regNo.toLowerCase().includes(q) ||
                    s.matNo.toLowerCase().includes(q) ||
                    s.phoneNo.toLowerCase().includes(q)
            );
        }

        if (selectedLevel !== "all") {
            filtered = filtered.filter((s) => s.level === selectedLevel);
        }

        return filtered;
    }, [students, searchQuery, selectedLevel, selectedProgram, selectedSession]);

    const levels = useMemo(() => {
        const uniqueLevels = Array.from(new Set(students.map((s) => s.level))).filter(Boolean);
        return ["all", ...uniqueLevels].sort();
    }, [students]);

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedLevel("all");
        setSelectedProgram("all");
        setSelectedSession("all");
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
    const paginatedStudents = filteredStudents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedLevel, selectedProgram, selectedSession]);

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        const allIds = filteredStudents.map((s) => s.id);
        const allSelected = allIds.every((id) => selectedIds.includes(id));
        setSelectedIds(allSelected ? [] : allIds);
    };

    const toggleDropdown = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveDropdownId(activeDropdownId === id ? null : id);
    };

    const handleExport = () => {
        const exportData = filteredStudents.map((s) => ({
            "Reg No": s.regNo, "Mat No": s.matNo, Surname: s.surname, "Other Names": s.otherNames,
            Email: s.email, Phone: s.phoneNo, Sex: s.sex, Department: s.department,
            Faculty: s.faculty, Level: s.level, "Admission Mode": s.admissionMode,
            "Entry Qualification": s.entryQualification, "Degree Course": s.degreeCourse,
            "Program Duration": s.programDuration, "Degree Award Code": s.degreeAwardCode,
        }));
        exportToExcel(exportData, "Students_List", "Students");
        toaster.success({ title: "Exported successfully" });
    };

    const handleDownloadTemplate = () => {
        const link = document.createElement("a");
        link.href = "/departmental-admin/documents/Students_Sample_File.csv";
        link.setAttribute("download", "Students_Sample_File.csv");
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
    };

    const handleBulkDownload = async () => {
        if (selectedIds.length === 0) return;
        try {
            const blob = await StudentServices.bulkDownloadStudents(selectedIds);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "students_data.csv");
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
            toaster.success({ title: "Download started" });
        } catch {
            toaster.error({ title: "Failed to download" });
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        setIdsToDelete(selectedIds);
        setIsDeleteModalOpen(true);
    };

    const selectStyle: React.CSSProperties = {
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        fontSize: "13px",
        color: "#475569",
        background: "white",
        outline: "none",
        minWidth: "140px",
        cursor: "pointer",
    };

    return (
        <Box>
            {/* Header */}
            <Flex justifyContent="space-between" alignItems="flex-start" mb="10">
                <Box maxW="xl">
                    <Text fontSize="3xl" fontWeight="bold" color="slate.900">Students</Text>
                    <Text color="slate.500" mt="2">
                        {students.length} total students • {filteredStudents.length} filtered
                    </Text>
                </Box>
                <Flex alignItems="center" gap="3">
                    <Box as="button" onClick={handleDownloadTemplate} display="flex" alignItems="center" gap="2" px="4" py="2.5" bg="white" border="1px solid" borderColor="#1D7AD9" color="#1D7AD9" borderRadius="lg" fontSize="sm" fontWeight="bold" cursor="pointer" _hover={{ bg: "blue.50" }}>
                        <FileDown size={18} /> Download Sample File
                    </Box>
                    <Box as="button" onClick={() => setShowUpload(true)} display="flex" alignItems="center" gap="2" px="4" py="2.5" bg="white" border="1px solid" borderColor="#1D7AD9" color="#1D7AD9" borderRadius="lg" fontSize="sm" fontWeight="bold" cursor="pointer" _hover={{ bg: "blue.50" }}>
                        <FileUp size={18} /> Upload CSV
                    </Box>
                    <Box as="button" onClick={() => { setStudentToEdit(null); setShowAddForm(true); }} bg="#1D7AD9" color="white" px="6" py="2.5" borderRadius="lg" display="flex" alignItems="center" gap="2" fontSize="sm" fontWeight="bold" boxShadow="lg" cursor="pointer" _hover={{ bg: "blue.700" }} border="none">
                        <Plus size={18} /> Add Students
                    </Box>
                </Flex>
            </Flex>

            {/* Search & Filters Card */}
            <Box bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.100" boxShadow="sm" p="6" mb="4">
                <Flex alignItems="center" justifyContent="space-between" gap="4" flexWrap="wrap">
                    <Box position="relative" flex="1" maxW="md">
                        <input
                            type="text"
                            placeholder="Search by name, email or student ID"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: "100%", background: "white", border: "1px solid #e2e8f0", fontSize: "12px", padding: "8px 12px 8px 36px", borderRadius: "8px", outline: "none", color: "#334155" }}
                        />
                        <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" color="slate.400" pointerEvents="none">
                            <Search size={16} />
                        </Box>
                    </Box>
                    <Flex alignItems="center" gap="3" flexWrap="wrap">
                        <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} style={selectStyle}>
                            {levels.map((l) => (
                                <option key={l} value={l}>{l === "all" ? "All Levels" : l}</option>
                            ))}
                        </select>
                        <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)} style={selectStyle}>
                            <option value="all">All Programs</option>
                        </select>
                        <select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)} style={selectStyle}>
                            <option value="all">All Sessions</option>
                        </select>
                        <Box as="button" onClick={clearFilters} display="flex" alignItems="center" gap="2" px="6" py="2" bg="white" border="1px solid" borderColor="slate.200" borderRadius="lg" fontSize="xs" fontWeight="semibold" color="slate.800" cursor="pointer" _hover={{ bg: "slate.50" }}>
                            <X size={16} /> Clear Filters
                        </Box>
                    </Flex>
                </Flex>
            </Box>

            {/* Export Table header */}
            <Flex alignItems="center" justifyContent="space-between" mb="4">
                <Text fontSize="lg" fontWeight="bold" color="slate.800">Students ({filteredStudents.length})</Text>
                <Box as="button" onClick={handleExport} display="flex" alignItems="center" gap="2" px="4" py="2" bg="white" border="1px solid" borderColor="slate.200" borderRadius="xl" fontSize="xs" fontWeight="semibold" color="slate.600" cursor="pointer" _hover={{ bg: "slate.50" }}>
                    <Download size={16} color="#94a3b8" /> Export Table
                </Box>
            </Flex>

            {/* Table */}
            {loading ? (
                <Flex alignItems="center" justifyContent="center" minH="400px">
                    <Flex direction="column" alignItems="center" gap="4">
                        <Spinner size="xl" color="blue.500" borderWidth="3px" />
                        <Text color="slate.500">Loading students...</Text>
                    </Flex>
                </Flex>
            ) : paginatedStudents.length === 0 ? (
                <Box textAlign="center" py="16" bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.100" boxShadow="sm">
                    <Text color="slate.400" fontWeight="bold" fontSize="lg" mb="2">No Students Found</Text>
                    <Text color="slate.400" fontSize="sm">Try changing your search or filter criteria</Text>
                </Box>
            ) : (
                <Box bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.100" boxShadow="sm" overflow="hidden" maxW="calc(100vw - 340px)">
                    <Box overflowX="auto">
                        <Box as="table" w="full" textAlign="left">
                            <Box as="thead">
                                <Box as="tr" bg="slate.50" borderBottom="1px solid" borderColor="gray.100" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">
                                    <Box as="th" px="6" py="5" w="12" textAlign="center" position="sticky" left="0" zIndex="20" bg="slate.50">
                                        <input
                                            type="checkbox"
                                            checked={filteredStudents.length > 0 && selectedIds.length > 0 && selectedIds.length === filteredStudents.length}
                                            onChange={toggleSelectAll}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </Box>
                                    <Box as="th" px="6" py="5" minW="150px">Reg No.</Box>
                                    <Box as="th" px="6" py="5" minW="150px">Mat. No.</Box>
                                    <Box as="th" px="6" py="5" minW="150px">Surname</Box>
                                    <Box as="th" px="6" py="5" minW="150px">Other Names</Box>
                                    <Box as="th" px="6" py="5" minW="200px">Email</Box>
                                    <Box as="th" px="6" py="5" minW="140px">Phone No</Box>
                                    <Box as="th" px="6" py="5" minW="100px">Gender</Box>
                                    <Box as="th" px="6" py="5" minW="150px">Admission Mode</Box>
                                    <Box as="th" px="6" py="5" minW="150px">Entry Qualification</Box>
                                    <Box as="th" px="6" py="5" minW="150px">Faculty</Box>
                                    <Box as="th" px="6" py="5" minW="150px">Department</Box>
                                    <Box as="th" px="6" py="5" minW="100px">Level</Box>
                                    <Box as="th" px="6" py="5" minW="150px">Degree Course</Box>
                                    <Box as="th" px="6" py="5" minW="120px">Course Duration</Box>
                                    <Box as="th" px="6" py="5" minW="150px">Degree Award Code</Box>
                                    <Box as="th" px="6" py="5" minW="100px">Status</Box>
                                    <Box as="th" px="6" py="5" textAlign="right" pr="12" position="sticky" right="0" zIndex="20" bg="slate.50">Action</Box>
                                </Box>
                            </Box>
                            <Box as="tbody" fontSize="xs">
                                {paginatedStudents.map((s) => (
                                    <Box as="tr" key={s.id} _hover={{ bg: "slate.50" }} borderBottom="1px solid" borderColor="gray.50" bg={selectedIds.includes(s.id) ? "blue.50" : undefined} cursor="pointer" whiteSpace="nowrap">
                                        <Box as="td" px="6" py="5" textAlign="center" position="sticky" left="0" zIndex="10" bg={selectedIds.includes(s.id) ? "blue.50" : "white"} borderBottom="1px solid" borderColor="gray.50">
                                            <input type="checkbox" checked={selectedIds.includes(s.id)} onChange={() => toggleSelection(s.id)} onClick={(e) => e.stopPropagation()} style={{ cursor: "pointer" }} />
                                        </Box>
                                        <Box as="td" px="6" py="5" color="slate.400" fontWeight="medium">{s.regNo}</Box>
                                        <Box as="td" px="6" py="5" color="slate.500">{s.matNo}</Box>
                                        <Box as="td" px="6" py="5" fontWeight="bold" color="slate.700">{s.surname}</Box>
                                        <Box as="td" px="6" py="5" fontWeight="medium" color="slate.600">{s.otherNames}</Box>
                                        <Box as="td" px="6" py="5" color="slate.500">{s.email}</Box>
                                        <Box as="td" px="6" py="5" color="slate.500">{s.phoneNo}</Box>
                                        <Box as="td" px="6" py="5" color="slate.500" textTransform="capitalize">{s.sex}</Box>
                                        <Box as="td" px="6" py="5" color="slate.500" textTransform="capitalize">{s.admissionMode}</Box>
                                        <Box as="td" px="6" py="5" color="slate.500">{s.entryQualification}</Box>
                                        <Box as="td" px="6" py="5" color="slate.500">{s.faculty}</Box>
                                        <Box as="td" px="6" py="5" color="slate.500">{s.department}</Box>
                                        <Box as="td" px="6" py="5" color="slate.500">{s.level}</Box>
                                        <Box as="td" px="6" py="5" color="slate.500">{s.degreeCourse}</Box>
                                        <Box as="td" px="6" py="5" color="slate.500">{s.programDuration}</Box>
                                        <Box as="td" px="6" py="5" color="slate.500">{s.degreeAwardCode}</Box>
                                        <Box as="td" px="6" py="5">
                                            <Text as="span" px="3" py="1" borderRadius="full" fontSize="10px" fontWeight="bold" bg={s.isActive ? "green.100" : "red.100"} color={s.isActive ? "green.700" : "red.700"}>
                                                {s.isActive ? "Active" : "Inactive"}
                                            </Text>
                                        </Box>
                                        <Box as="td" px="6" py="5" textAlign="right" pr="12" position="sticky" right="0" zIndex={activeDropdownId === s.id ? "50" : "10"} bg={selectedIds.includes(s.id) ? "blue.50" : "white"} borderBottom="1px solid" borderColor="gray.50" ref={dropdownRef}>
                                            <Box position="relative">
                                                <Box as="button" onClick={(e: React.MouseEvent) => toggleDropdown(s.id, e)} p="1" _hover={{ bg: "slate.100" }} borderRadius="full" cursor="pointer" border="none" bg="transparent" color="slate.400">
                                                    <MoreHorizontal size={20} />
                                                </Box>

                                                {activeDropdownId === s.id && (
                                                    <Box position="absolute" right="0" top="8" w="48" bg="white" borderRadius="xl" boxShadow="xl" border="1px solid" borderColor="gray.100" zIndex="50" overflow="hidden" textAlign="left">
                                                        <Box p="1">
                                                            <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setSelectedStudent(s); setActiveDropdownId(null); }} w="full" display="flex" alignItems="center" gap="2" px="3" py="2" fontSize="sm" fontWeight="medium" color="green.600" _hover={{ bg: "green.50" }} borderRadius="lg" cursor="pointer" border="none" bg="transparent">
                                                                <UserCog size={16} /> Assign Role
                                                            </Box>
                                                            <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setStudentToEdit(s); setShowAddForm(true); setActiveDropdownId(null); }} w="full" display="flex" alignItems="center" gap="2" px="3" py="2" fontSize="sm" fontWeight="medium" color="amber.600" _hover={{ bg: "amber.50" }} borderRadius="lg" cursor="pointer" border="none" bg="transparent">
                                                                <Pencil size={16} /> Edit details
                                                            </Box>
                                                            <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setIdsToDelete([s.id]); setIsDeleteModalOpen(true); setActiveDropdownId(null); }} w="full" display="flex" alignItems="center" gap="2" px="3" py="2" fontSize="sm" fontWeight="medium" color="red.600" _hover={{ bg: "red.50" }} borderRadius="lg" cursor="pointer" border="none" bg="transparent">
                                                                <Trash2 size={16} /> Delete student
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>

                </Box>
            )}

            {/* Pagination - separate card below table */}
            {totalPages > 1 && (
                <Flex alignItems="center" justifyContent="space-between" bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.100" boxShadow="sm" p="4" mt="4">
                    <Text fontSize="sm" color="slate.500">
                        Showing{" "}
                        <Text as="span" fontWeight="semibold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredStudents.length)}</Text>
                        {" "}of <Text as="span" fontWeight="semibold">{filteredStudents.length}</Text> students
                        (Total: {students.length})
                    </Text>
                    <Flex alignItems="center" gap="2">
                        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: "8px 12px", background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", fontWeight: 500, color: "#334155", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.5 : 1 }}>
                            Previous
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            return (
                                <Box as="button" key={pageNum} onClick={() => setCurrentPage(pageNum)} px="3" py="2" borderRadius="lg" fontSize="sm" fontWeight="medium" cursor="pointer" border={currentPage === pageNum ? "none" : "1px solid"} borderColor="slate.200" bg={currentPage === pageNum ? "#1D7AD9" : "white"} color={currentPage === pageNum ? "white" : "slate.700"} _hover={{ bg: currentPage === pageNum ? "#1D7AD9" : "slate.50" }}>
                                    {pageNum}
                                </Box>
                            );
                        })}
                        <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: "8px 12px", background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", fontWeight: 500, color: "#334155", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.5 : 1 }}>
                            Next
                        </button>
                    </Flex>
                </Flex>
            )}

            {/* Floating Action Bar */}
            {selectedIds.length > 1 && (
                <Flex position="fixed" bottom="8" left="50%" transform="translateX(-50%)" bg="white" px="6" py="3" borderRadius="xl" boxShadow="2xl" border="1px solid" borderColor="gray.100" alignItems="center" gap="6" zIndex="50">
                    <Text fontSize="sm" fontWeight="bold" color="slate.700">{selectedIds.length} items selected</Text>
                    <Box w="px" h="6" bg="slate.200" />
                    <Box as="button" onClick={handleBulkDownload} display="flex" alignItems="center" gap="2" bg="#1D7AD9" color="white" px="4" py="2" borderRadius="lg" fontSize="xs" fontWeight="bold" _hover={{ bg: "blue.700" }} cursor="pointer" border="none">
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

            <BulkUploadStudentsModal isOpen={showUpload} onClose={() => setShowUpload(false)} onUploaded={() => { setShowUpload(false); fetchStudents(); }} />

            {/* Assign Role Sidebar */}
            {selectedStudent && (
                <StudentDetailsSidebar
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                />
            )}

            {/* Add/Edit Student Form */}
            {showAddForm && (
                <AddStudentForm
                    initialData={studentToEdit}
                    onClose={() => { setShowAddForm(false); setStudentToEdit(null); }}
                    onSubmit={async (data) => {
                        if (studentToEdit) {
                            await StudentServices.updateStudent(studentToEdit.id, data);
                            toaster.success({ title: "Student updated successfully" });
                        } else {
                            console.log("Adding student:", data);
                            toaster.success({ title: "Student added" });
                        }
                        setShowAddForm(false);
                        setStudentToEdit(null);
                        fetchStudents();
                    }}
                />
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setIdsToDelete([]); }}
                onConfirm={async (reason) => {
                    await StudentServices.bulkDeleteStudents(idsToDelete, reason);
                    toaster.success({ title: `${idsToDelete.length} student(s) deleted` });
                    setIsDeleteModalOpen(false);
                    setIdsToDelete([]);
                    setSelectedIds(prev => prev.filter(id => !idsToDelete.includes(id)));
                    fetchStudents();
                }}
                title="Delete Students"
                description="This action cannot be undone. This will permanently delete the selected student records from the system."
                itemCount={idsToDelete.length}
            />
        </Box>
    );
};

export default StudentsPage;
