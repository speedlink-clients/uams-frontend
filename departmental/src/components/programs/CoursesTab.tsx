import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Plus, Download, Upload, Edit, Trash2, X } from "lucide-react";
import { CourseServices } from "@services/course.service";
import { toaster } from "@components/ui/toaster";
import { exportToExcel } from "@utils/excel.util";
import { Box, Flex, Text, Input, Spinner } from "@chakra-ui/react";
import BulkUploadCoursesModal from "@components/programs/BulkUploadCoursesModal";

interface CoursesTabProps {
    isCreatingRoute?: boolean;
    isEditingRoute?: boolean;
}

const CoursesTab = ({ isCreatingRoute, isEditingRoute }: CoursesTabProps) => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const [formData, setFormData] = useState({ name: "", code: "", creditUnit: "3", description: "" });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setIsLoading(true);
            const data = await CourseServices.getCoursesByDepartment();
            const list = Array.isArray(data) ? data : (data as any)?.data || (data as any)?.courses || [];
            setCourses(list);
        } catch (err) {
            toaster.error({ title: "Failed to load courses" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await CourseServices.createCourse({ ...formData, creditUnits: Number(formData.creditUnit) } as any);
            toaster.success({ title: "Course created" });
            await fetchCourses();
            navigate("/program-courses/courses");
        } catch (error: any) {
            toaster.error({ title: error.response?.data?.message || "Failed to create course" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Delete this course?")) {
            try {
                await CourseServices.deleteCourse(id);
                toaster.success({ title: "Course deleted" });
                await fetchCourses();
            } catch (err) {
                toaster.error({ title: "Failed to delete" });
            }
        }
    };

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map((c) => c.id));
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected courses?`)) {
            try {
                await Promise.all(selectedIds.map((id) => CourseServices.deleteCourse(id)));
                toaster.success({ title: `${selectedIds.length} courses deleted` });
                setSelectedIds([]);
                await fetchCourses();
            } catch (err) {
                toaster.error({ title: "Failed to delete some courses" });
            }
        }
    };

    const handleExport = () => {
        exportToExcel(courses.map((c) => ({
            Code: c.code,
            "Course Title": c.title || c.name,
            Level: c.level?.name || "N/A",
            Semester: c.semester?.name || "N/A",
            "Credit Units": c.creditUnits || c.creditUnit,
            "Learning Hours": c.learningHours || "N/A",
            "Practical Hours": c.practicalHours || "N/A",
            Status: c.status === "C" ? "Core" : "Elective",
        })), "Courses", "Courses");
    };

    const formatSemesterName = (name: string) => {
        if (!name) return name;
        if (name.toLowerCase() === "semester 1") return "First Semester";
        if (name.toLowerCase() === "semester 2") return "Second Semester";
        if (name.toLowerCase() === "semester 3") return "Third Semester";
        return name;
    };

    const filtered = courses.filter((c) => !searchTerm || (c.title || c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || c.code?.toLowerCase().includes(searchTerm.toLowerCase()));

    if (isLoading) {
        return (
            <Flex alignItems="center" justifyContent="center" minH="400px">
                <Flex direction="column" alignItems="center" gap="4">
                    <Spinner size="xl" color="blue.500" borderWidth="3px" />
                    <Text color="slate.500">Loading courses...</Text>
                </Flex>
            </Flex>
        );
    }

    if (isCreatingRoute || isEditingRoute) {
        return (
            <Box bg="white" borderRadius="2xl" p="8" border="1px solid" borderColor="gray.100" boxShadow="sm">
                <Text fontSize="xl" fontWeight="bold" color="slate.800" mb="8">{isEditingRoute ? "Edit Course" : "Create Course"}</Text>
                <Flex direction={{ base: "column", lg: "row" }} gap="8">
                    <Flex direction="column" gap="6" flex="1">
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Course Name</Text>
                            <Input value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Data Structures" bg="slate.50" border="1px solid" borderColor="gray.200" borderRadius="lg" />
                        </Box>
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Course Code</Text>
                            <Input value={formData.code} onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))} placeholder="e.g. CSC 201" bg="slate.50" border="1px solid" borderColor="gray.200" borderRadius="lg" />
                        </Box>
                    </Flex>
                    <Flex direction="column" gap="6" flex="1">
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Credit Units</Text>
                            <select value={formData.creditUnit} onChange={(e) => setFormData((p) => ({ ...p, creditUnit: e.target.value }))} style={{ width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 12px", fontSize: "14px" }}>
                                {["1", "2", "3", "4", "5", "6"].map((v) => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </Box>
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Description</Text>
                            <textarea value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} rows={3} style={{ width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 12px", fontSize: "14px" }} />
                        </Box>
                    </Flex>
                </Flex>
                <Flex justifyContent="flex-end" gap="3" mt="8">
                    <Box as="button" onClick={() => navigate("/program-courses/courses")} px="8" py="2.5" borderRadius="lg" fontSize="sm" border="1px solid" borderColor="slate.300" color="slate.600" cursor="pointer" _hover={{ bg: "slate.50" }}>Cancel</Box>
                    <Flex as="button" onClick={handleSave} px="8" py="2.5" borderRadius="lg" fontSize="sm" fontWeight="bold" bg="#00B01D" color="white" cursor="pointer" border="none" _hover={{ bg: "green.700" }} opacity={isSaving ? 0.5 : 1}>
                        {isSaving ? "Saving..." : "Create Course"}
                    </Flex>
                </Flex>
            </Box>
        );
    }

    return (
        <Flex direction="column" gap="8">
            <Flex justifyContent="flex-end" gap="4">
                <Box as="button" onClick={handleExport} bg="white" color="blue.600" px="5" py="2.5" borderRadius="xl" display="flex" alignItems="center" gap="2" fontSize="sm" fontWeight="bold" boxShadow="lg" _hover={{ bg: "blue.50" }} border="none" cursor="pointer">
                    <Download size={18} /> Export table
                </Box>
                <Box as="button" onClick={() => setIsUploadOpen(true)} bg="white" color="blue.600" px="5" py="2.5" borderRadius="xl" display="flex" alignItems="center" gap="2" fontSize="sm" fontWeight="bold" boxShadow="lg" _hover={{ bg: "blue.50" }} border="none" cursor="pointer">
                    <Upload size={18} /> Upload CSV
                </Box>
                <Box as="button" onClick={() => navigate("/program-courses/courses/new")} bg="blue.600" color="white" px="5" py="2.5" borderRadius="xl" display="flex" alignItems="center" gap="2" fontSize="sm" fontWeight="bold" _hover={{ bg: "blue.700" }} border="none" cursor="pointer">
                    <Plus size={18} /> Create Course
                </Box>
            </Flex>

            <Box bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.100" boxShadow="sm">
                <Flex p="6" alignItems="center" justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold" color="slate.800">Created Courses ({filtered.length})</Text>
                    <Input placeholder="Search by title, code, or level..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} maxW="64" bg="white" border="1px solid" borderColor="slate.200" borderRadius="xl" fontSize="xs" px="4" py="2.5" />
                </Flex>

                <Box overflowX="auto">
                    <Box as="table" w="full" textAlign="left">
                        <Box as="thead">
                            <Box as="tr" bg="slate.50" borderY="1px solid" borderColor="gray.100">
                                <Box as="th" px="6" py="4" w="12" textAlign="center">
                                    <input type="checkbox" checked={filtered.length > 0 && selectedIds.length === filtered.length} onChange={toggleSelectAll} style={{ cursor: "pointer" }} />
                                </Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase">Code</Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase">Course Title</Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase">Level</Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase">Semester</Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase">Credit Units</Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase">Learning Hours</Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase">Practical Hours</Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase">Status</Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="slate.500" textTransform="uppercase" textAlign="center">Actions</Box>
                            </Box>
                        </Box>
                        <Box as="tbody">
                            {filtered.length === 0 ? (
                                <Box as="tr"><td colSpan={10} style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8" }}>{searchTerm ? "No courses match your search" : "No courses found"}</td></Box>
                            ) : filtered.map((course) => (
                                <Box as="tr" key={course.id} _hover={{ bg: "slate.50" }} borderBottom="1px solid" borderColor="gray.50" fontSize="sm" color="slate.600" bg={selectedIds.includes(course.id) ? "blue.50" : undefined}>
                                    <Box as="td" px="6" py="4" textAlign="center">
                                        <input type="checkbox" checked={selectedIds.includes(course.id)} onChange={() => toggleSelection(course.id)} style={{ cursor: "pointer" }} />
                                    </Box>
                                    <Box as="td" px="6" py="4" fontWeight="medium">{course.code}</Box>
                                    <Box as="td" px="6" py="4">{course.title || course.name}</Box>
                                    <Box as="td" px="6" py="4">{course.level?.name || "—"}</Box>
                                    <Box as="td" px="6" py="4">{formatSemesterName(course.semester?.name)}</Box>
                                    <Box as="td" px="6" py="4">{course.creditUnits || course.creditUnit || "—"}</Box>
                                    <Box as="td" px="6" py="4">{course.learningHours || "—"}</Box>
                                    <Box as="td" px="6" py="4">{course.practicalHours || "—"}</Box>
                                    <Box as="td" px="6" py="4">{course.status === "C" ? "Core" : "Elective"}</Box>
                                    <Box as="td" px="6" py="4" textAlign="center">
                                        <Flex justifyContent="center" gap="2">
                                            <Box as="button" onClick={() => navigate(`/program-courses/courses/edit/${course.id}`)} p="1" _hover={{ bg: "slate.100" }} borderRadius="full" color="slate.400" cursor="pointer" border="none" bg="transparent"><Edit size={16} /></Box>
                                            <Box as="button" onClick={() => handleDelete(course.id)} p="1" _hover={{ bg: "red.50" }} borderRadius="full" color="red.400" cursor="pointer" border="none" bg="transparent"><Trash2 size={16} /></Box>
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
                <Flex position="fixed" bottom="8" left="50%" transform="translateX(-50%)" bg="white" px="6" py="3" borderRadius="xl" boxShadow="2xl" border="1px solid" borderColor="gray.100" alignItems="center" gap="6" zIndex="50">
                    <Text fontSize="sm" fontWeight="bold" color="slate.700">{selectedIds.length} items selected</Text>
                    <Box w="px" h="6" bg="slate.200" />
                    <Box as="button" onClick={handleBulkDelete} display="flex" alignItems="center" gap="2" bg="red.500" color="white" px="4" py="2" borderRadius="lg" fontSize="xs" fontWeight="bold" _hover={{ bg: "red.600" }} cursor="pointer" border="none">
                        <Trash2 size={16} /> Delete
                    </Box>
                    <Box w="px" h="6" bg="slate.200" />
                    <Box as="button" onClick={() => setSelectedIds([])} p="1" _hover={{ bg: "slate.100" }} borderRadius="full" color="slate.400" cursor="pointer" border="none" bg="transparent" title="Unselect all">
                        <X size={20} />
                    </Box>
                </Flex>
            )}
            {/* Bulk Upload Modal */}
            <BulkUploadCoursesModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUploaded={() => { setIsUploadOpen(false); fetchCourses(); }} />
        </Flex>
    );
};

export default CoursesTab;
