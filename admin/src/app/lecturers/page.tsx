import { useState, useEffect, useMemo, useRef } from "react";
import { Plus, FileUp, MoreHorizontal, UserCog, Pencil, Trash2, Download, X, Users, Search } from "lucide-react";
import { exportToExcel } from "@utils/excel.util";
import {
  Box, Flex, Text, Input, Spinner,
  Portal,
  EmptyState,
  Menu,
  InputGroup,
  Button,
  VStack,
  Table
} from "@chakra-ui/react";
import BulkUploadStaffModal from "@components/lecturers/BulkUploadStaffModal";
import AssignCourseModal from "@components/lecturers/AssignCourseModal";
import AddStaffForm from "@components/lecturers/AddStaffForm";
import { StaffHook } from "@hooks/staff.hook";
import type { Staff } from "@type/staff.type";
import {
  PaginationRoot,
  PaginationItems,
  PaginationPrevTrigger,
  PaginationNextTrigger
} from "@components/ui/pagination";

const ITEMS_PER_PAGE = 10;

const StaffPage = () => {
  const { data: staffList = [], isLoading: loading } = StaffHook.useStaff();
  const deleteMutation = StaffHook.useDeleteStaff();
  const bulkDeleteMutation = StaffHook.useBulkDeleteStaff();
  const addStaffMutation = StaffHook.useAddStaff();
  const updateStaffMutation = StaffHook.useUpdateStaff();
  const assignCourseMutation = StaffHook.useAssignCourse();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLTableCellElement>(null);

  // Action modals state
  const [showAssignCourse, setShowAssignCourse] = useState(false);
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [staffToEdit, setStaffToEdit] = useState<any>(null);

  // Removed fetchStaff and useEffect as TanStack Query handles it now

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
    return result;
  }, [staffList, searchQuery]);

  const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);
  const paginatedStaff = filteredStaff.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
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
        await bulkDeleteMutation.mutateAsync(selectedIds);
        setSelectedIds([]);
      } catch (err) {
        // Error handled by mutation
      }
    }
  };

  const handleDelete = async (staff: Staff) => {
    if (window.confirm(`Delete lecturer "${staff.fullName}"?`)) {
      try {
        await deleteMutation.mutateAsync(staff.id);
      } catch (err) {
        // Error handled by mutation
      }
    }
  };

  const handleAssignCourse = async (data: { courseId: string; session: string }) => {
    if (!selectedStaff) return;
    try {
      await assignCourseMutation.mutateAsync({
        courseId: data.courseId,
        lecturerId: selectedStaff.id,
        session: data.session
      });
      setShowAssignCourse(false);
      setSelectedStaff(null);
    } catch (err) {
      // Error handled by mutation
    }
  };

  const handleAddEditSubmit = async (payload: any) => {
    try {
      if (staffToEdit) {
        await updateStaffMutation.mutateAsync({ id: staffToEdit.id, payload });
      } else {
        await addStaffMutation.mutateAsync(payload);
      }
      setShowAddEditForm(false);
      setStaffToEdit(null);
    } catch (err) {
      // Error handled by mutation
    }
  };

  // const clearFilters = () => {
  //   setSearchQuery("");
  //   setFilterDepartment("");
  //   setFilterRank("");
  //   setCurrentPage(1);
  // };

  return (
    <Box>
      <Flex direction={{ base: "column", md: "row" }} justifyContent="space-between" alignItems={{ base: "flex-start", md: "center" }} mb="6" gap="4">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="fg.muted">Lecturers</Text>
          <Text fontSize="sm" color="fg.muted">Manage department lecturers and their roles</Text>
        </Box>
        <Flex gap="3" flexWrap="nowrap" alignItems="center" w={{ base: "full", md: "auto" }}>
          <InputGroup startElement={<Search size={18} color="#94a3b8" />} flex="1">
            <Input
              placeholder="Search by name, email or staff ID"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              bg="white"
              border="xs"
              borderColor="border.muted"
              borderRadius="md"
              py="2.5"
              pl="10"
              pr="4"
              fontSize="sm"
              w="full"
              maxW={{ base: "full", md: "320px" }}
              _focus={{ borderColor: "blue.500", boxShadow: "none" }}
            />
          </InputGroup>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Box as="button" flexShrink={0} bg="#1D7AD9" color="white" px="5" py="2.5" fontSize="sm" fontWeight="bold" cursor="pointer" _hover={{ bg: "blue.700" }} border="none" display="flex" alignItems="center" gap="2" borderRadius="md">
                <Plus size={16} /> Add Lecturer
              </Box>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content bg="white" borderRadius="md" boxShadow="none" border="xs" borderColor="border.muted" minW="150px" overflow="hidden" py="1" zIndex="popover">
                  <Menu.Item value="single" asChild>
                    <Box as="button" onClick={() => { setStaffToEdit(null); setShowAddEditForm(true); }} w="full" textAlign="left" px="4" py="2.5" fontSize="sm" fontWeight="medium" color="fg.muted" _hover={{ bg: "slate.50" }} cursor="pointer" border="none" bg="transparent" display="flex" alignItems="center" gap="2">
                      <UserCog size={16} /> Single
                    </Box>
                  </Menu.Item>
                  <Menu.Item value="bulk" asChild>
                    <Box as="button" onClick={() => setShowUploadModal(true)} w="full" textAlign="left" px="4" py="2.5" fontSize="sm" fontWeight="medium" color="fg.muted" _hover={{ bg: "slate.50" }} cursor="pointer" border="none" bg="transparent" display="flex" alignItems="center" gap="2">
                      <FileUp size={16} /> Bulk
                    </Box>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Flex>
      </Flex>

      {/* Table */}
      <Box bg="white" borderRadius="md" border="xs" borderColor="border.muted" overflow="hidden" maxW={{ base: "100%", lg: "calc(100vw - 340px)" }}>
        <Box overflowX="auto">
          <Table.Root w="full" textAlign="left" variant="line" interactive>
            <Table.Header bg="slate.50">
              <Table.Row borderY="xs" borderColor="border.muted">
                <Table.ColumnHeader bg="slate.50" px="6" py="4" w="12" textAlign="center" position="sticky" left="0" zIndex="20" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">
                  <input
                    type="checkbox"
                    checked={filteredStaff.length > 0 && selectedIds.length > 0 && selectedIds.length === filteredStaff.length}
                    onChange={toggleSelectAll}
                    style={{ cursor: "pointer" }}
                  />
                </Table.ColumnHeader>
                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="150px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">Staff ID</Table.ColumnHeader>
                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="150px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">Name</Table.ColumnHeader>
                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="200px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">Email</Table.ColumnHeader>
                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="140px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">Phone No</Table.ColumnHeader>
                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="150px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">Department</Table.ColumnHeader>
                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="150px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">Rank</Table.ColumnHeader>
                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="200px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">Course(s)</Table.ColumnHeader>
                <Table.ColumnHeader bg="slate.50" px="6" py="4" textAlign="right" pr="12" position="sticky" right="0" zIndex="20" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">Action</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body fontSize="xs">
              {loading ? (
                <Table.Row>
                  <Table.Cell colSpan={9} py="12" textAlign="center">
                    <Flex direction="column" alignItems="center" gap="4">
                      <Spinner size="xl" color="blue.500" borderWidth="3px" />
                      <Text color="fg.muted">Loading lecturers...</Text>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ) : paginatedStaff.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={9} py="12">
                    <EmptyState.Root>
                        <EmptyState.Content>
                            <EmptyState.Indicator>
                                <Users />
                            </EmptyState.Indicator>
                            <VStack textAlign="center">
                                <EmptyState.Title>No Lecturers Found</EmptyState.Title>
                                <EmptyState.Description>
                                    {searchQuery ? "Try adjusting your search criteria" : "Add a new lecturer to get started"}
                                </EmptyState.Description>
                            </VStack>
                            {!searchQuery && (
                                <Button onClick={() => { setStaffToEdit(null); setShowAddEditForm(true); }} bg="#1D7AD9" color="white" _hover={{ bg: "blue.700" }} px="6" fontSize="sm" fontWeight="bold">
                                    Add Lecturer
                                </Button>
                            )}
                        </EmptyState.Content>
                    </EmptyState.Root>
                  </Table.Cell>
                </Table.Row>
              ) : (
                paginatedStaff.map((s) => (
                  <Table.Row key={s.id} _hover={{ bg: "slate.50" }} borderBottom="xs" borderColor="border.muted" bg={selectedIds.includes(s.id) ? "blue.50" : "transparent"} cursor="pointer" whiteSpace="nowrap">
                    <Table.Cell px="6" py="5" textAlign="center" position="sticky" left="0" zIndex="10" bg={selectedIds.includes(s.id) ? "blue.50" : "white"} borderBottom="xs" borderColor="border.muted">
                      <input type="checkbox" checked={selectedIds.includes(s.id)} onChange={() => toggleSelection(s.id)} onClick={(e) => e.stopPropagation()} style={{ cursor: "pointer" }} />
                    </Table.Cell>
                    <Table.Cell px="6" py="5" color="fg.subtle" fontWeight="medium">{s.staffNumber}</Table.Cell>
                    <Table.Cell px="6" py="5" fontWeight="bold" color="fg.muted">{s.fullName}</Table.Cell>
                    <Table.Cell px="6" py="5" color="fg.muted">{s.email}</Table.Cell>
                    <Table.Cell px="6" py="5" color="fg.muted">{s.phone || "—"}</Table.Cell>
                    <Table.Cell px="6" py="5" color="fg.muted">{s.department}</Table.Cell>
                    <Table.Cell px="6" py="5" color="fg.muted">{s.level}</Table.Cell>
                    <Table.Cell px="6" py="5">
                      <Flex gap="1.5" wrap="wrap" maxW="200px">
                        {s.courses?.split(", ").map((course, idx) => (
                          <Text key={idx} as="span" bg="#2ECC71" color="white" px="3" py="1" borderRadius="md" fontSize="10px" fontWeight="bold" boxShadow="sm" display="inline-block" textAlign="center" minW={course === "N/A" ? "60px" : "auto"}>
                            {course}
                          </Text>
                        ))}
                      </Flex>
                    </Table.Cell>
                    <Table.Cell px="6" py="5" textAlign="right" pr="12" position="sticky" right="0" zIndex={activeDropdownId === s.id ? "50" : "10"} bg={selectedIds.includes(s.id) ? "blue.50" : "white"} borderBottom="xs" borderColor="border.muted" ref={dropdownRef}>
                      <Box position="relative">
                        <Box as="button" onClick={(e: React.MouseEvent) => toggleDropdown(s.id, e)} p="1" _hover={{ bg: "fg.subtle" }} borderRadius="full" cursor="pointer" border="none" bg="transparent" color="fg.subtle">
                          <MoreHorizontal size={20} />
                        </Box>
                        {activeDropdownId === s.id && (
                          <Box position="absolute" right="0" top="8" w="48" bg="white" borderRadius="md" boxShadow="none" border="xs" borderColor="border.muted" zIndex="50" overflow="hidden" textAlign="left">
                            <Box p="1">
                              <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setSelectedStaff(s); setShowAssignCourse(true); setActiveDropdownId(null); }} w="full" display="flex" alignItems="center" gap="2" px="3" py="2" fontSize="sm" fontWeight="medium" color="green.600" _hover={{ bg: "green.50" }} borderRadius="md" cursor="pointer" border="none" bg="transparent">
                                <UserCog size={16} /> Assign Course
                              </Box>
                              <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setStaffToEdit(s); setShowAddEditForm(true); setActiveDropdownId(null); }} w="full" display="flex" alignItems="center" gap="2" px="3" py="2" fontSize="sm" fontWeight="medium" color="amber.600" _hover={{ bg: "amber.50" }} borderRadius="md" cursor="pointer" border="none" bg="transparent">
                                <Pencil size={16} /> Edit details
                              </Box>
                              <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleDelete(s); setActiveDropdownId(null); }} w="full" display="flex" alignItems="center" gap="2" px="3" py="2" fontSize="sm" fontWeight="medium" color="red.600" _hover={{ bg: "red.50" }} borderRadius="md" cursor="pointer" border="none" bg="transparent">
                                <Trash2 size={16} /> Delete Lecturer
                              </Box>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Box>

        {totalPages > 1 && (
            <Flex alignItems="center" justifyContent="space-between" p="4" bg="white" borderTop="xs" borderColor="border.muted">
              <Text fontSize="sm" color="fg.muted">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredStaff.length)} of {filteredStaff.length} lecturers
              </Text>
              <PaginationRoot 
                  count={filteredStaff.length} 
                  pageSize={ITEMS_PER_PAGE} 
                  page={currentPage}
                  onPageChange={(e) => setCurrentPage(e.page)}
                  variant="outline"
                  size="sm"
              >
                  <Flex gap="2">
                      <PaginationPrevTrigger />
                      <PaginationItems />
                      <PaginationNextTrigger />
                  </Flex>
              </PaginationRoot>
            </Flex>
          )}
        </Box>

      {selectedIds.length > 1 && (
        <Flex position="fixed" bottom="8" left="50%" transform="translateX(-50%)" bg="white" px={{ base: "4", md: "6" }} py="3" borderRadius="md" boxShadow="none" border="xs" borderColor="border.muted" alignItems="center" gap={{ base: "3", md: "6" }} zIndex="50" flexWrap="wrap" justifyContent="center" w={{ base: "90%", md: "auto" }}>
          <Text fontSize="sm" fontWeight="bold" color="fg.muted">{selectedIds.length} items selected</Text>
          <Box w="px" h="6" bg="fg.subtle" />
          <Box as="button" onClick={() => { exportToExcel(staffList.filter((s) => selectedIds.includes(s.id)).map((s) => ({ "Staff ID": s.staffNumber, Name: s.fullName, Email: s.email, Phone: s.phone || "N/A", Department: s.department, Level: s.level, Courses: s.courses })), "selected_lecturers", "Lecturers"); }} display="flex" alignItems="center" gap="2" bg="#1D7AD9" color="white" px="4" py="2" borderRadius="md" fontSize="xs" fontWeight="bold" _hover={{ bg: "blue.700" }} cursor="pointer" border="none">
            <Download size={16} /> Bulk Download
          </Box>
          <Box as="button" onClick={handleBulkDelete} display="flex" alignItems="center" gap="2" bg="red.500" color="white" px="4" py="2" borderRadius="md" fontSize="xs" fontWeight="bold" _hover={{ bg: "red.600" }} cursor="pointer" border="none">
            <Trash2 size={16} /> Bulk Delete
          </Box>
          <Box w="px" h="6" bg="fg.subtle" />
          <Box as="button" onClick={() => setSelectedIds([])} p="1" _hover={{ bg: "fg.subtle" }} borderRadius="full" color="fg.subtle" cursor="pointer" border="none" bg="transparent" title="Unselect all">
            <X size={20} />
          </Box>
        </Flex>
      )}

      <BulkUploadStaffModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploaded={() => {
          setShowUploadModal(false);
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