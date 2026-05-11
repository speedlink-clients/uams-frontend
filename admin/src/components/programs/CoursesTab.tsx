import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Plus, Download, Edit, Trash2, X, Search } from "lucide-react";
import { CourseServices } from "@services/course.service";
import { ProgramServices } from "@services/program.service";
import { toaster } from "@components/ui/toaster";
import { exportToExcel } from "@utils/excel.util";
import {
  createListCollection,
  Box,
  Flex,
  Text,
  Input,
  Spinner,
  Textarea,
  Button,
  InputGroup,
  Select,
  Portal,
  Table,
  EmptyState,
  VStack,
  Menu,
  Dialog,
  Field,
} from "@chakra-ui/react";
import { Switch } from "@components/ui/switch";
import {
  LuFileSpreadsheet,
  LuFileText,
  LuPlus,
  LuFileUp,
} from "react-icons/lu";
import BulkUploadCoursesModal from "@components/programs/BulkUploadCoursesModal";

interface CoursesTabProps {
  isCreatingRoute?: boolean;
  isEditingRoute?: boolean;
}

const creditUnitCollection = createListCollection({
  items: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map((value) => ({
    label: value,
    value: value,
  })),
});

const semesterCollection = createListCollection({
  items: [
    { label: "FIRST", value: "FIRST" },
    { label: "SECOND", value: "SECOND" },
    { label: "THIRD", value: "THIRD" },
  ],
});

const levelCollection = createListCollection({
  items: [
    { label: "L100", value: "L100" },
    { label: "L200", value: "L200" },
    { label: "L300", value: "L300" },
    { label: "L400", value: "L400" },
  ],
});

const courseTypeCollection = createListCollection({
  items: [
    { label: "CORE", value: "CORE" },
    { label: "ELECTIVE", value: "ELECTIVE" },
    { label: "GST", value: "GST" },
    { label: "SIWES", value: "SIWES" },
    { label: "PROJECT", value: "PROJECT" },
  ],
});

const semesterFilterCollection = createListCollection({
  items: [
    { label: "All Semesters", value: "" },
    { label: "First Semester", value: "FIRST" },
    { label: "Second Semester", value: "SECOND" },
  ],
});

const levelFilterCollection = createListCollection({
  items: [
    { label: "All Levels", value: "" },
    { label: "100 Level", value: "L100" },
    { label: "200 Level", value: "L200" },
    { label: "300 Level", value: "L300" },
    { label: "400 Level", value: "L400" },
  ],
});

const CoursesTab = ({ isCreatingRoute, isEditingRoute }: CoursesTabProps) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [programTypes, setProgramTypes] = useState<any[]>([]);
  const [filters, setFilters] = useState({ level: "", semester: "" });
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    units: "3",
    description: "",
    semester: "FIRST",
    level: "L100",
    programTypeId: "",
    courseType: "CORE",
    allowCarryover: true,
  });

  const isFormOpen = isCreatingRoute || isEditingRoute;

  const handleCloseForm = () => {
    navigate("/program-courses/courses");
    setFormData({
      title: "",
      code: "",
      programTypeId: "",
      level: "L100",
      semester: "FIRST",
      description: "",
      units: "3",
      courseType: "CORE",
      allowCarryover: true,
    });
  };

  const programTypeCollection = createListCollection({
    items: programTypes.map((pt) => ({ label: pt.name, value: pt.id })),
  });

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const apiFilters = {
        level: filters.level || undefined,
        semester: filters.semester || undefined,
      };
      const [coursesData, typesData] = await Promise.all([
        CourseServices.getCourses(apiFilters),
        ProgramServices.getProgramTypes(),
      ]);
      const list = Array.isArray(coursesData)
        ? coursesData
        : (coursesData as any)?.data || (coursesData as any)?.courses || [];
      const types = Array.isArray(typesData)
        ? typesData
        : (typesData as any)?.data || [];
      setCourses(list);
      setProgramTypes(types);
    } catch (err) {
      toaster.error({ title: "Failed to load courses data" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await CourseServices.createCourse({
        ...formData,
        units: Number(formData.units),
      } as any);
      toaster.success({ title: "Course created" });
      await fetchCourses();
      navigate("/program-courses/courses");
    } catch (error: any) {
      toaster.error({
        title: error.response?.data?.message || "Failed to create course",
      });
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
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === filtered.length ? [] : filtered.map((c) => c.id),
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} selected courses?`,
      )
    ) {
      try {
        await Promise.all(
          selectedIds.map((id) => CourseServices.deleteCourse(id)),
        );
        toaster.success({ title: `${selectedIds.length} courses deleted` });
        setSelectedIds([]);
        await fetchCourses();
      } catch (err) {
        toaster.error({ title: "Failed to delete some courses" });
      }
    }
  };

  const handleExportExcel = () => {
    exportToExcel(
      courses.map((c) => ({
        Code: c.code,
        "Course Title": c.title || c.name,
        Level: c.level?.name || "N/A",
        Semester: c.semester?.name || "N/A",
        "Credit Units": c.creditUnits || c.creditUnit,
        "Learning Hours": c.learningHours || "N/A",
        "Practical Hours": c.practicalHours || "N/A",
        Status: c.status === "C" ? "Core" : "Elective",
      })),
      "Courses",
      "Courses",
    );
  };

  const handleExportPDF = () => {
    import("jspdf").then(({ jsPDF }) => {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Courses List", 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);

      let y = 35;
      doc.text("S/N", 14, y);
      doc.text("CODE", 25, y);
      doc.text("TITLE", 50, y);
      doc.text("LEVEL", 130, y);
      doc.text("UNITS", 160, y);

      doc.line(14, y + 2, 200, y + 2);
      y += 10;

      courses.forEach((c, i) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(`${i + 1}`, 14, y);
        doc.text(`${c.code}`, 25, y);
        doc.text(`${(c.title || c.name).substring(0, 35)}`, 50, y);
        doc.text(`${c.level?.name || "N/A"}`, 130, y);
        doc.text(`${c.creditUnits || c.creditUnit}`, 160, y);
        y += 8;
      });

      doc.save("Courses_Report.pdf");
      toaster.success({ title: "PDF Report downloaded" });
    });
  };

  const formatSemesterName = (name: string) => {
    if (!name) return name;
    if (name.toLowerCase() === "semester 1") return "First Semester";
    if (name.toLowerCase() === "semester 2") return "Second Semester";
    if (name.toLowerCase() === "semester 3") return "Third Semester";
    return name;
  };

  const filtered = courses.filter(
    (c) =>
      !searchTerm ||
      (c.title || c.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      c.code?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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

  return (
    <Flex direction="column" gap="8">
      <Flex justifyContent="flex-end" gap="4">
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button
              bg="slate.100"
              color="slate.700"
              size="xl"
              display="flex"
              alignItems="center"
              gap="2"
              fontSize="md"
              fontWeight="bold"
              cursor="pointer"
              boxShadow="none"
              _hover={{ bg: "slate.200" }}
            >
              <Download size={20} /> Export table
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content
                bg="white"
                boxShadow="xl"
                borderRadius="md"
                border="xs"
                borderColor="border.muted"
                minW="180px"
              >
                <Menu.Item
                  value="excel"
                  onClick={handleExportExcel}
                  cursor="pointer"
                  py="3"
                  px="4"
                  _hover={{ bg: "slate.50" }}
                >
                  <LuFileSpreadsheet size={18} color="slate.50" />
                  <Box flex="1" ml="2">
                    Export as Excel
                  </Box>
                </Menu.Item>
                <Menu.Item
                  value="pdf"
                  onClick={handleExportPDF}
                  cursor="pointer"
                  py="3"
                  px="4"
                  _hover={{ bg: "slate.50" }}
                >
                  <LuFileText size={18} color="slate.50" />
                  <Box flex="1" ml="2">
                    Export as PDF
                  </Box>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button
              bg="accent"
              color="white"
              size="xl"
              display="flex"
              alignItems="center"
              gap="2"
              fontSize="md"
              fontWeight="bold"
              cursor="pointer"
              boxShadow="none"
            >
              <Plus size={20} /> Add Course
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content
                bg="white"
                boxShadow="xl"
                borderRadius="md"
                border="xs"
                borderColor="border.muted"
                minW="180px"
              >
                <Menu.Item
                  value="single"
                  onClick={() => navigate("/program-courses/courses/new")}
                  cursor="pointer"
                  py="3"
                  px="4"
                  _hover={{ bg: "slate.50" }}
                >
                  <LuPlus size={18} color="slate.50" />
                  <Box flex="1" ml="2">
                    Single Course
                  </Box>
                </Menu.Item>
                <Menu.Item
                  value="bulk"
                  onClick={() => setIsUploadOpen(true)}
                  cursor="pointer"
                  py="3"
                  px="4"
                  _hover={{ bg: "slate.50" }}
                >
                  <LuFileUp size={18} color="slate.50" />
                  <Box flex="1" ml="2">
                    Bulk Upload (Excel)
                  </Box>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>

      <Box
        bg="white"
        borderRadius="md"
        borderWidth="xs"
        borderColor="border.muted"
        boxShadow="none"
      >
        <Flex p="6" alignItems="center">
          <Text fontSize="lg" fontWeight="bold" color="slate.800">
            All Courses ({filtered.length})
          </Text>
          <Flex gap="3" ml="auto">
            <Select.Root
              collection={levelFilterCollection}
              value={[filters.level]}
              onValueChange={(e) =>
                setFilters((p) => ({ ...p, level: e.value[0] }))
              }
              size="sm"
              width="150px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger
                  bg="white"
                  border="xs"
                  borderColor="border.muted"
                  py="2.5"
                >
                  <Select.ValueText placeholder="Level" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {levelFilterCollection.items.map((item: any) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>

            <Select.Root
              collection={semesterFilterCollection}
              value={[filters.semester]}
              onValueChange={(e) =>
                setFilters((p) => ({ ...p, semester: e.value[0] }))
              }
              size="sm"
              width="150px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger
                  bg="white"
                  border="xs"
                  borderColor="border.muted"
                  py="2.5"
                >
                  <Select.ValueText placeholder="Semester" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {semesterFilterCollection.items.map((item: any) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>

            <InputGroup
              startElement={<Search size={16} color="gray" />}
              width="320px"
            >
              <Input
                placeholder="Search by title, code, or level..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg="white"
                border="xs"
                borderColor="border.muted"
                fontSize="sm"
                px="4"
                py="2.5"
                ps="10"
              />
            </InputGroup>
          </Flex>
        </Flex>

        <Box overflowX="auto">
          <Table.Root w="full" variant="line" interactive>
            <Table.Header bg="slate.50">
              <Table.Row borderY="xs" borderColor="border.muted">
                <Table.ColumnHeader px="6" py="4" w="12" textAlign="center">
                  <input
                    type="checkbox"
                    checked={
                      filtered.length > 0 &&
                      selectedIds.length === filtered.length
                    }
                    onChange={toggleSelectAll}
                    style={{ cursor: "pointer" }}
                  />
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="semibold"
                  color="slate.500"
                  textTransform="uppercase"
                >
                  S/N
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="semibold"
                  color="slate.500"
                  textTransform="uppercase"
                >
                  COURSE CODE
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="semibold"
                  color="slate.500"
                  textTransform="uppercase"
                >
                  COURSE TITLE
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="semibold"
                  color="slate.500"
                  textTransform="uppercase"
                >
                  LEVEL
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="semibold"
                  color="slate.500"
                  textTransform="uppercase"
                >
                  SEMESTER
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="semibold"
                  color="slate.500"
                  textTransform="uppercase"
                >
                  CREDIT UNITS
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="semibold"
                  color="slate.500"
                  textTransform="uppercase"
                >
                  LEARNING HOURS
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="semibold"
                  color="slate.500"
                  textTransform="uppercase"
                >
                  PRACTICAL HOURS
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="semibold"
                  color="slate.500"
                  textTransform="uppercase"
                >
                  STATUS
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="semibold"
                  color="slate.500"
                  textTransform="uppercase"
                  textAlign="center"
                >
                  ACTIONS
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filtered.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={11} py="12">
                    <EmptyState.Root>
                      <EmptyState.Content>
                        <EmptyState.Indicator>
                          <Search size={40} />
                        </EmptyState.Indicator>
                        <VStack textAlign="center">
                          <EmptyState.Title>
                            {searchTerm
                              ? "No Matches Found"
                              : "No Courses Found"}
                          </EmptyState.Title>
                          <EmptyState.Description>
                            {searchTerm
                              ? "Try adjusting your search or filters to find what you're looking for."
                              : "Get started by adding your first course to the system."}
                          </EmptyState.Description>
                        </VStack>
                      </EmptyState.Content>
                    </EmptyState.Root>
                  </Table.Cell>
                </Table.Row>
              ) : (
                filtered.map((course, index) => (
                  <Table.Row
                    key={course.id}
                    _hover={{ bg: "slate.50" }}
                    borderColor="border.muted"
                    fontSize="sm"
                    color="slate.600"
                    bg={selectedIds.includes(course.id) ? "blue.50" : undefined}
                  >
                    <Table.Cell px="6" py="4" textAlign="center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(course.id)}
                        onChange={() => toggleSelection(course.id)}
                        style={{ cursor: "pointer" }}
                      />
                    </Table.Cell>
                    <Table.Cell px="6" py="4">
                      {index + 1}
                    </Table.Cell>
                    <Table.Cell px="6" py="4" fontWeight="medium">
                      {course.code}
                    </Table.Cell>
                    <Table.Cell px="6" py="4">
                      {course.title || course.name}
                    </Table.Cell>
                    <Table.Cell px="6" py="4">
                      {course.level?.name || "—"}
                    </Table.Cell>
                    <Table.Cell px="6" py="4">
                      {formatSemesterName(course.semester?.name)}
                    </Table.Cell>
                    <Table.Cell px="6" py="4">
                      {course.creditUnits || course.creditUnit || "—"}
                    </Table.Cell>
                    <Table.Cell px="6" py="4">
                      {course.learningHours || "—"}
                    </Table.Cell>
                    <Table.Cell px="6" py="4">
                      {course.practicalHours || "—"}
                    </Table.Cell>
                    <Table.Cell px="6" py="4">
                      {course.status === "C" ? "Core" : "Elective"}
                    </Table.Cell>
                    <Table.Cell px="6" py="4" textAlign="center">
                      <Flex justifyContent="center" gap="2">
                        <Button
                          onClick={() =>
                            navigate(
                              `/program-courses/courses/edit/${course.id}`,
                            )
                          }
                          p="1"
                          variant="ghost"
                          size="sm"
                          color="slate.400"
                          _hover={{ bg: "slate.100" }}
                          borderRadius="full"
                          minW="auto"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          onClick={() => handleDelete(course.id)}
                          p="1"
                          variant="ghost"
                          size="sm"
                          color="red.400"
                          _hover={{ bg: "red.50" }}
                          borderRadius="full"
                          minW="auto"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>

      {/* Floating Action Bar */}
      {selectedIds.length > 0 && (
        <Flex
          position="fixed"
          bottom="8"
          left="50%"
          transform="translateX(-50%)"
          bg="white"
          px="6"
          py="3"
          borderRadius="xl"
          boxShadow="2xl"
          border="xs"
          borderColor="border.muted"
          alignItems="center"
          gap="6"
          zIndex="50"
        >
          <Text fontSize="sm" fontWeight="bold" color="slate.700">
            {selectedIds.length} items selected
          </Text>
          <Box w="px" h="6" bg="slate.200" />
          <Button
            onClick={handleBulkDelete}
            bg="red.500"
            color="white"
            px="4"
            py="2"
            borderRadius="lg"
            fontSize="xs"
            fontWeight="bold"
            _hover={{ bg: "red.600" }}
          >
            <Trash2 size={16} /> Delete
          </Button>
          <Box w="px" h="6" bg="slate.200" />
          <Button
            onClick={() => setSelectedIds([])}
            variant="ghost"
            p="1"
            borderRadius="lg"
            color="slate.400"
            _hover={{ bg: "slate.100" }}
            title="Unselect all"
          >
            <X size={20} />
          </Button>
        </Flex>
      )}

      {/* Bulk Upload Modal */}
      <BulkUploadCoursesModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploaded={() => {
          setIsUploadOpen(false);
          fetchCourses();
        }}
      />

      <Dialog.Root
        open={isFormOpen}
        onOpenChange={(e) => !e.open && handleCloseForm()}
        size="lg"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="sm" overflow="hidden">
              <Dialog.CloseTrigger />
              <Dialog.Header p="6" borderBottom="xs" borderColor="border.muted">
                <VStack align="start" gap={1}>
                  <Dialog.Title
                    fontSize="lg"
                    fontWeight="bold"
                    color="slate.800"
                  >
                    {isEditingRoute ? "Edit Course" : "Add New Course"}
                  </Dialog.Title>

                  <Dialog.Description fontSize="sm" color="slate.500">
                    Fill in the details below to{" "}
                    {isEditingRoute
                      ? "update the course"
                      : "create a new course"}
                    .
                  </Dialog.Description>
                </VStack>
              </Dialog.Header>

              <Dialog.Body p="8">
                <Flex direction="column" gap="6">
                  <Flex gap="4">
                    <Field.Root flex="6.5">
                      <Field.Label
                        fontSize="sm"
                        fontWeight="medium"
                        color="slate.700"
                      >
                        Course Title
                      </Field.Label>
                      <Input
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, title: e.target.value }))
                        }
                        placeholder="e.g. Data Structures"
                        size="xl"
                        _placeholder={{ color: "fg.subtle" }}
                      />
                    </Field.Root>

                    <Field.Root flex="3.5">
                      <Field.Label
                        fontSize="sm"
                        fontWeight="medium"
                        color="slate.700"
                      >
                        Course Code
                      </Field.Label>
                      <Input
                        value={formData.code}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, code: e.target.value }))
                        }
                        placeholder="e.g. CSC 201"
                        size="xl"
                        _placeholder={{ color: "fg.subtle" }}
                      />
                    </Field.Root>
                  </Flex>

                  <Flex gap="4">
                    <Field.Root flex="1">
                      <Field.Label
                        fontSize="sm"
                        fontWeight="medium"
                        color="slate.700"
                      >
                        Course Type
                      </Field.Label>
                      <Select.Root
                        collection={courseTypeCollection}
                        value={[formData.courseType]}
                        onValueChange={(e) =>
                          setFormData((p) => ({ ...p, courseType: e.value[0] }))
                        }
                        size="lg"
                      >
                        <Select.HiddenSelect />
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select type" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                          <Select.Positioner>
                            <Select.Content>
                              {courseTypeCollection.items.map((item: any) => (
                                <Select.Item key={item.value} item={item}>
                                  {item.label}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Portal>
                      </Select.Root>
                    </Field.Root>

                    <Field.Root flex="1">
                      <Field.Label
                        fontSize="sm"
                        fontWeight="medium"
                        color="slate.700"
                      >
                        Program Type
                      </Field.Label>
                      <Select.Root
                        collection={programTypeCollection}
                        value={[formData.programTypeId]}
                        onValueChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            programTypeId: e.value[0],
                          }))
                        }
                        size="lg"
                      >
                        <Select.HiddenSelect />
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select program" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                          <Select.Positioner>
                            <Select.Content>
                              {programTypeCollection.items.map((item: any) => (
                                <Select.Item key={item.value} item={item}>
                                  {item.label}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Portal>
                      </Select.Root>
                    </Field.Root>
                  </Flex>

                  <Flex gap="4">
                    <Field.Root flex="1">
                      <Field.Label
                        fontSize="sm"
                        fontWeight="medium"
                        color="slate.700"
                      >
                        Level
                      </Field.Label>
                      <Select.Root
                        collection={levelCollection}
                        value={[formData.level]}
                        onValueChange={(e) =>
                          setFormData((p) => ({ ...p, level: e.value[0] }))
                        }
                        size="lg"
                      >
                        <Select.HiddenSelect />
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select level" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                          <Select.Positioner>
                            <Select.Content>
                              {levelCollection.items.map((item: any) => (
                                <Select.Item key={item.value} item={item}>
                                  {item.label}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Portal>
                      </Select.Root>
                    </Field.Root>

                    <Field.Root flex="1">
                      <Field.Label
                        fontSize="sm"
                        fontWeight="medium"
                        color="slate.700"
                      >
                        Semester
                      </Field.Label>
                      <Select.Root
                        collection={semesterCollection}
                        value={[formData.semester]}
                        onValueChange={(e) =>
                          setFormData((p) => ({ ...p, semester: e.value[0] }))
                        }
                        size="lg"
                      >
                        <Select.HiddenSelect />
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select semester" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                          <Select.Positioner>
                            <Select.Content>
                              {semesterCollection.items.map((item: any) => (
                                <Select.Item key={item.value} item={item}>
                                  {item.label}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Portal>
                      </Select.Root>
                    </Field.Root>
                  </Flex>

                  <Flex gap="4">
                    <Field.Root flex="1">
                      <Field.Label
                        fontSize="sm"
                        fontWeight="medium"
                        color="slate.700"
                      >
                        Credit Units
                      </Field.Label>
                      <Select.Root
                        collection={creditUnitCollection}
                        value={[formData.units]}
                        onValueChange={(e) =>
                          setFormData((p) => ({ ...p, units: e.value[0] }))
                        }
                        size="lg"
                      >
                        <Select.HiddenSelect />
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select units" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                          <Select.Positioner>
                            <Select.Content>
                              {creditUnitCollection.items.map((item: any) => (
                                <Select.Item key={item.value} item={item}>
                                  {item.label}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Portal>
                      </Select.Root>
                    </Field.Root>
                    <Field.Root flex="1">
                      <Field.Label
                        fontSize="sm"
                        fontWeight="medium"
                        color="slate.700"
                      >
                        Allow Carryover
                      </Field.Label>
                      <Box pt="2">
                        <Switch
                          checked={formData.allowCarryover}
                          onCheckedChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              allowCarryover: !!e.checked,
                            }))
                          }
                          colorPalette="blue"
                        >
                          {formData.allowCarryover ? "Yes" : "No"}
                        </Switch>
                      </Box>
                    </Field.Root>
                  </Flex>

                  <Field.Root>
                    <Field.Label
                      fontSize="sm"
                      fontWeight="medium"
                      color="slate.700"
                    >
                      Description
                    </Field.Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                      size="xl"
                      placeholder="Enter course description..."
                      _placeholder={{ color: "fg.subtle" }}
                    />
                  </Field.Root>
                </Flex>
              </Dialog.Body>

              <Dialog.Footer
                p="6"
                borderTop="xs"
                borderColor="border.muted"
                gap="3"
              >
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    borderColor="border.muted"
                    color="slate.600"
                    px="8"
                    fontWeight="bold"
                  >
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  onClick={handleSave}
                  loading={isSaving}
                  loadingText="Saving..."
                  bg="#1D7AD9"
                  color="white"
                  px="10"
                  fontWeight="bold"
                >
                  {isEditingRoute ? "Update Course" : "Create Course"}
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Flex>
  );
};

export default CoursesTab;
