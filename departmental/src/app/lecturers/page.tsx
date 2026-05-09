import { useState, useEffect, useMemo, useRef } from "react";
import { Plus, FileUp, Filter, MoreHorizontal, UserCog, Pencil, Trash2, Download, X, Search } from "lucide-react";
import { toaster } from "@components/ui/toaster";
import { exportToExcel } from "@utils/excel.util";
import {
  Box,
  Flex,
  Text,
  Input,
  Spinner,
  createListCollection,
  Select,
  Portal,
  Button,
  InputGroup,
} from "@chakra-ui/react";
import BulkUploadStaffModal from "@components/lecturers/BulkUploadStaffModal";
import AssignCourseModal from "@components/lecturers/AssignCourseModal";
import AddStaffForm from "@components/lecturers/AddStaffForm";
import { StaffServices } from "@services/staff.service";
import { LuX } from "react-icons/lu";

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

  // Filter states
  const [filterDepartment, setFilterDepartment] = useState<string>("");
  const [filterRank, setFilterRank] = useState<string>("");

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
        department: item.department?.name?.trim() || "N/A",
        level: item.academicRank?.trim() || "N/A",
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

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const uniqueDepartments = useMemo(() => {
    const depts = new Set(staffList.map((s) => s.department).filter((d) => d && d !== "N/A"));
    return Array.from(depts).sort();
  }, [staffList]);

  const uniqueRanks = useMemo(() => {
    const ranks = new Set(staffList.map((s) => s.level).filter((l) => l && l !== "N/A"));
    return Array.from(ranks).sort();
  }, [staffList]);

  // Collections for Select components
  const departmentCollection = createListCollection({
    items: [{ label: "All Departments", value: "" }, ...uniqueDepartments.map((dept) => ({ label: dept, value: dept }))],
  });

  const rankCollection = createListCollection({
    items: [{ label: "All Ranks", value: "" }, ...uniqueRanks.map((rank) => ({ label: rank, value: rank }))],
  });

  const filteredStaff = useMemo(() => {
    let result = staffList;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.staffNumber?.toLowerCase().includes(q)
      );
    }
    if (filterDepartment) {
      result = result.filter((s) => s.department === filterDepartment);
    }
    if (filterRank) {
      result = result.filter((s) => s.level === filterRank);
    }
    return result;
  }, [staffList, searchQuery, filterDepartment, filterRank]);

  const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);
  const paginatedStaff = filteredStaff.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    const allIds = filteredStaff.map((s) => s.id);
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

  const clearFilters = () => {
    setSearchQuery("");
    setFilterDepartment("");
    setFilterRank("");
    setCurrentPage(1);
  };

  return (
    <Box>
      {/* Header */}
      <Flex direction={{ base: "column", md: "row" }} justifyContent="space-between" alignItems={{ base: "flex-start", md: "center" }} mb="2" gap="4">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="slate.800">
            Lecturers
          </Text>
          <Text fontSize="sm" color="slate.500">
            Manage department lecturers and their roles
          </Text>
        </Box>
        <Flex gap="3" flexWrap="wrap">
          <Button
            onClick={() => setShowUploadModal(true)}
            bg="white"
            border="1px solid"
            borderColor="border.subtle"
            color="#1D7AD9"
            px="4"
            py="2.5"
            borderRadius="lg"
            fontSize="sm"
            fontWeight="bold"
            cursor="pointer"
            display="flex"
            alignItems="center"
            gap="2"
          >
            <FileUp size={18} /> Upload CSV
          </Button>
          <Button
            onClick={() => {
              setStaffToEdit(null);
              setShowAddEditForm(true);
            }}
            bg="#1D7AD9"
            color="white"
            px="6"
            py="2.5"
            borderRadius="lg"
            fontSize="sm"
            fontWeight="bold"
            cursor="pointer"
            display="flex"
            alignItems="center"
            gap="2"
          >
            <Plus size={18} /> Add Lecturer
          </Button>
        </Flex>
      </Flex>

      {/* Search & Filter Card */}
      <Box bg="white" borderRadius="2xl" border="1px solid" borderColor="border.subtle" p="6" mb="4">
        <Flex alignItems="center" justifyContent="space-between" gap="4" flexWrap="wrap">
          <Box position="relative" flex="1" maxW="md">
            <InputGroup startElement={<Search size={16} />} width="100%">
              <Input
                type="text"
                placeholder="Search by name, email or staff ID"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: "100%",
                  background: "white",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                  padding: "8px 12px 8px 36px",
                  borderRadius: "8px",
                  outline: "none",
                  color: "#334155",
                }}
              />
            </InputGroup>
          </Box>
          <Flex alignItems="center" gap="3">
            {/* Department Filter */}
            <Select.Root
              collection={departmentCollection}
              value={filterDepartment ? [filterDepartment] : [""]}
              onValueChange={(e) => {
                setFilterDepartment(e.value[0] || "");
                setCurrentPage(1);
              }}
              size="md"
              width="180px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="All Departments" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {departmentCollection.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>

            {/* Rank Filter */}
            <Select.Root
              collection={rankCollection}
              value={filterRank ? [filterRank] : [""]}
              onValueChange={(e) => {
                setFilterRank(e.value[0] || "");
                setCurrentPage(1);
              }}
              size="md"
              width="160px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="All Ranks" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {rankCollection.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>

            <Button
              onClick={clearFilters}
              display="flex"
              alignItems="center"
              gap="2"
              px="6"
              py="2"
              bg="white"
              border="1px solid"
              borderColor="border.subtle"
              borderRadius="lg"
              fontSize="xs"
              fontWeight="semibold"
              color="slate.800"
              cursor="pointer"
            >
              <LuX size={16} /> Clear Filters
            </Button>
          </Flex>
        </Flex>
      </Box>

      {/* Export Table header */}
      <Flex alignItems="center" justifyContent="space-between" mb="4">
        <Text fontSize="lg" fontWeight="bold" color="slate.800">
          Lecturers ({filteredStaff.length})
        </Text>
        <Button
          onClick={() => {
            exportToExcel(
              filteredStaff.map((s) => ({
                "Staff ID": s.staffNumber,
                Name: s.fullName,
                Email: s.email,
                Phone: s.phone || "N/A",
                Department: s.department,
                Rank: s.level,
                Courses: s.courses,
              })),
              "All_Lecturers",
              "Lecturers"
            );
          }}
          display="flex"
          alignItems="center"
          gap="2"
          px="4"
          py="2"
          bg="white"
          border="1px solid"
          borderColor="border.subtle"
          borderRadius="xl"
          fontSize="xs"
          fontWeight="semibold"
          color="slate.600"
          cursor="pointer"
        >
          <Download size={16} color="#94a3b8" /> Export Table
        </Button>
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
        <Box textAlign="center" py="16" bg="white" borderRadius="2xl" border="1px solid" borderColor="border.subtle" boxShadow="sm">
          <Text color="slate.400" fontWeight="bold" fontSize="lg" mb="2">
            No Lecturers Found
          </Text>
          <Text color="slate.400" fontSize="sm">
            Try changing your search or filter criteria
          </Text>
        </Box>
      ) : (
        <Box
          bg="white"
          borderRadius="2xl"
          border="1px solid"
          borderColor="border.subtle"
          boxShadow="sm"
          overflow="hidden"
          maxW={{ base: "100%", lg: "calc(100vw - 340px)" }}
        >
          <Box overflowX="auto">
            <Box as="table" w="full" textAlign="left">
              <Box as="thead">
                <Box
                  as="tr"
                  bg="slate.50"
                  borderBottom="1px solid"
                  borderColor="border.subtle"
                  fontSize="11px"
                  fontWeight="bold"
                  color="slate.500"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  whiteSpace="nowrap"
                >
                  <Box as="th" px="6" py="5" w="12" textAlign="center" position="sticky" left="0" zIndex="20" bg="slate.50">
                    <input
                      type="checkbox"
                      checked={
                        filteredStaff.length > 0 &&
                        selectedIds.length > 0 &&
                        selectedIds.length === filteredStaff.length
                      }
                      onChange={toggleSelectAll}
                      style={{ cursor: "pointer" }}
                    />
                  </Box>
                  <Box as="th" px="6" py="5" minW="150px">
                    Staff ID
                  </Box>
                  <Box as="th" px="6" py="5" minW="150px">
                    Name
                  </Box>
                  <Box as="th" px="6" py="5" minW="200px">
                    Email
                  </Box>
                  <Box as="th" px="6" py="5" minW="140px">
                    Phone No
                  </Box>
                  <Box as="th" px="6" py="5" minW="150px">
                    Department
                  </Box>
                  <Box as="th" px="6" py="5" minW="150px">
                    Rank
                  </Box>
                  <Box as="th" px="6" py="5" minW="200px">
                    Course(s)
                  </Box>
                  <Box
                    as="th"
                    px="6"
                    py="5"
                    textAlign="right"
                    pr="12"
                    position="sticky"
                    right="0"
                    zIndex="20"
                    bg="slate.50"
                  >
                    Action
                  </Box>
                </Box>
              </Box>
              <Box as="tbody" fontSize="xs">
                {paginatedStaff.map((s) => (
                  <Box
                    as="tr"
                    key={s.id}
                    _hover={{ bg: "slate.50" }}
                    borderBottom="1px solid"
                    borderColor="gray.50"
                    bg={selectedIds.includes(s.id) ? "blue.50" : undefined}
                    cursor="pointer"
                    whiteSpace="nowrap"
                  >
                    <Box
                      as="td"
                      px="6"
                      py="5"
                      textAlign="center"
                      position="sticky"
                      left="0"
                      zIndex="10"
                      bg={selectedIds.includes(s.id) ? "blue.50" : "white"}
                      borderBottom="1px solid"
                      borderColor="border.subtle"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(s.id)}
                        onChange={() => toggleSelection(s.id)}
                        onClick={(e) => e.stopPropagation()}
                        style={{ cursor: "pointer" }}
                      />
                    </Box>
                    <Box as="td" px="6" py="5" color="slate.400" fontWeight="medium">
                      {s.staffNumber}
                    </Box>
                    <Box as="td" px="6" py="5" fontWeight="bold" color="slate.700">
                      {s.fullName}
                    </Box>
                    <Box as="td" px="6" py="5" color="slate.500">
                      {s.email}
                    </Box>
                    <Box as="td" px="6" py="5" color="slate.500">
                      {s.phone || "—"}
                    </Box>
                    <Box as="td" px="6" py="5" color="slate.500">
                      {s.department}
                    </Box>
                    <Box as="td" px="6" py="5" color="slate.500">
                      {s.level}
                    </Box>
                    <Box as="td" px="6" py="5">
                      <Flex gap="1.5" wrap="wrap" maxW="200px">
                        {s.courses?.split(", ").map((course, idx) => (
                          <Text
                            key={idx}
                            as="span"
                            bg="#2ECC71"
                            color="white"
                            px="3"
                            py="1"
                            borderRadius="md"
                            fontSize="10px"
                            fontWeight="bold"
                            boxShadow="sm"
                            display="inline-block"
                            textAlign="center"
                            minW={course === "N/A" ? "60px" : "auto"}
                          >
                            {course}
                          </Text>
                        ))}
                      </Flex>
                    </Box>
                    <Box
                      as="td"
                      px="6"
                      py="5"
                      textAlign="right"
                      pr="12"
                      position="sticky"
                      right="0"
                      zIndex={activeDropdownId === s.id ? "50" : "10"}
                      bg={selectedIds.includes(s.id) ? "blue.50" : "white"}
                      borderBottom="1px solid"
                      borderColor="border.subtle"
                      ref={dropdownRef}
                    >
                      <Box position="relative">
                        <Button
                          onClick={(e: React.MouseEvent) => toggleDropdown(s.id, e)}
                          p="1"
                          borderRadius="full"
                          cursor="pointer"
                          border="none"
                          bg="transparent"
                          color="slate.400"
                        >
                          <MoreHorizontal size={20} />
                        </Button>

                        {activeDropdownId === s.id && (
                          <Box
                            position="absolute"
                            right="0"
                            top="8"
                            w="48"
                            bg="white"
                            borderRadius="xl"
                            boxShadow="xl"
                            border="1px solid"
                            borderColor="border.subtle"
                            zIndex="50"
                            overflow="hidden"
                            textAlign="left"
                          >
                            <Box p="1">
                              <Button
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                  e.stopPropagation();
                                  setSelectedStaff(s);
                                  setShowAssignCourse(true);
                                  setActiveDropdownId(null);
                                }}
                                w="full"
                                display="flex"
                                alignItems="center"
                                gap="2"
                                px="3"
                                py="2"
                                fontSize="sm"
                                fontWeight="medium"
                                color="green.600"
                                _hover={{ bg: "green.50" }}
                                borderRadius="lg"
                                cursor="pointer"
                                border="none"
                                bg="transparent"
                              >
                                <UserCog size={16} /> Assign Course
                              </Button>
                              <Button
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                  e.stopPropagation();
                                  setStaffToEdit(s);
                                  setShowAddEditForm(true);
                                  setActiveDropdownId(null);
                                }}
                                w="full"
                                display="flex"
                                alignItems="center"
                                gap="2"
                                px="3"
                                py="2"
                                fontSize="sm"
                                fontWeight="medium"
                                color="amber.600"
                                _hover={{ bg: "amber.50" }}
                                borderRadius="lg"
                                cursor="pointer"
                                border="none"
                                bg="transparent"
                              >
                                <Pencil size={16} /> Edit details
                              </Button>
                              <Button
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                  e.stopPropagation();
                                  handleDelete(s);
                                  setActiveDropdownId(null);
                                }}
                                w="full"
                                display="flex"
                                alignItems="center"
                                gap="2"
                                px="3"
                                py="2"
                                fontSize="sm"
                                fontWeight="medium"
                                color="red.600"
                                _hover={{ bg: "red.50" }}
                                borderRadius="lg"
                                cursor="pointer"
                                border="none"
                                bg="transparent"
                              >
                                <Trash2 size={16} /> Delete Lecturer
                              </Button>
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

          {/* Pagination */}
          {totalPages > 0 && (
            <Flex
              alignItems="center"
              justifyContent="space-between"
              bg="white"
              borderRadius="2xl"
              border="1px solid"
              borderColor="border.subtle"
              p="4"
              mt="4"
            >
              <Text fontSize="sm" color="slate.500">
                Showing{" "}
                <Text as="span" fontWeight="semibold">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredStaff.length)}
                </Text>{" "}
                of <Text as="span" fontWeight="semibold">{filteredStaff.length}</Text> lecturers (Total: {staffList.length})
              </Text>
              <Flex alignItems="center" gap="2">
                <Button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: "8px 12px",
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#334155",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    opacity: currentPage === 1 ? 0.5 : 1,
                  }}
                >
                  Previous
                </Button>
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
                    <Button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      px="3"
                      py="2"
                      borderRadius="lg"
                      fontSize="sm"
                      fontWeight="medium"
                      cursor="pointer"
                      border={currentPage === pageNum ? "none" : "1px solid"}
                      borderColor="slate.200"
                      bg={currentPage === pageNum ? "#1D7AD9" : "white"}
                      color={currentPage === pageNum ? "white" : "slate.700"}
                      _hover={{ bg: currentPage === pageNum ? "#1D7AD9" : "slate.50" }}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: "8px 12px",
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#334155",
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    opacity: currentPage === totalPages ? 0.5 : 1,
                  }}
                >
                  Next
                </Button>
              </Flex>
            </Flex>
          )}
        </Box>
      )}

      {/* Floating Action Bar */}
      {selectedIds.length > 1 && (
        <Flex
          position="fixed"
          bottom="8"
          left="50%"
          transform="translateX(-50%)"
          bg="white"
          px={{ base: "4", md: "6" }}
          py="3"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.100"
          alignItems="center"
          gap={{ base: "3", md: "6" }}
          zIndex="50"
          flexWrap="wrap"
          justifyContent="center"
          w={{ base: "90%", md: "auto" }}
        >
          <Text fontSize="sm" fontWeight="bold" color="slate.700">
            {selectedIds.length} items selected
          </Text>
          <Box w="px" h="6" bg="slate.200" />
          <Button
            onClick={() => {
              exportToExcel(
                staffList
                  .filter((s) => selectedIds.includes(s.id))
                  .map((s) => ({
                    "Staff ID": s.staffNumber,
                    Name: s.fullName,
                    Email: s.email,
                    Phone: s.phone || "N/A",
                    Department: s.department,
                    Rank: s.level,
                    Courses: s.courses,
                  })),
                "selected_lecturers",
                "Lecturers"
              );
            }}
            display="flex"
            alignItems="center"
            gap="2"
            bg="#1D7AD9"
            color="white"
            px="4"
            py="2"
            borderRadius="lg"
            fontSize="xs"
            fontWeight="bold"
            cursor="pointer"
          >
            <Download size={16} /> Bulk Download
          </Button>
          <Button
            onClick={handleBulkDelete}
            display="flex"
            alignItems="center"
            gap="2"
            bg="red.500"
            color="white"
            px="4"
            py="2"
            borderRadius="lg"
            fontSize="xs"
            fontWeight="bold"
            _hover={{ bg: "red.600" }}
            cursor="pointer"
          >
            <Trash2 size={16} /> Bulk Delete
          </Button>
          <Box w="px" h="6" bg="slate.200" />
          <Button
            onClick={() => setSelectedIds([])}
            p="1"
            _hover={{ bg: "slate.100" }}
            borderRadius="full"
            color="slate.400"
            cursor="pointer"
            title="Unselect all"
          >
            <X size={20} />
          </Button>
        </Flex>
      )}

      {/* Modals */}
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
        onClose={() => {
          setShowAssignCourse(false);
          setSelectedStaff(null);
        }}
        onAssign={handleAssignCourse}
        staffName={selectedStaff?.fullName}
      />

      <AddStaffForm
        isOpen={showAddEditForm}
        onClose={() => {
          setShowAddEditForm(false);
          setStaffToEdit(null);
        }}
        onSubmit={handleAddEditSubmit}
        initialData={staffToEdit}
      />
    </Box>
  );
};

export default StaffPage;