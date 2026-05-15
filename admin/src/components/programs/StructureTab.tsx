import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router";
import { Download, Edit, Plus, Search, Trash2, X } from "lucide-react";
import { AcademicServices } from "@services/academic.service";
import { toaster } from "@components/ui/toaster";
import { exportToExcel } from "@utils/excel.util";
import {
  Box,
  Flex,
  Text,
  Input,
  Spinner,
  Button,
  InputGroup,
  Select,
  Portal,
  createListCollection,
  Textarea,
  Checkbox,
  Table,
} from "@chakra-ui/react";

interface StructureTabProps {
  isCreatingRoute?: boolean;
  isEditingRoute?: boolean;
}

// Collections for Select.Root
const semesterCollection = createListCollection({
  items: [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
  ],
});

const durationCollection = createListCollection({
  items: [
    { label: "6 Months", value: "6 Months" },
    { label: "12 Months", value: "12 Months" },
    { label: "18 Months", value: "18 Months" },
  ],
});

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
      <Box bg="white" borderRadius="md" p="8" border="xs" borderColor="border.muted">
        <Text fontSize="xl" fontWeight="bold" color="fg.muted" mb="8">
          {isEditingRoute ? "Edit Session" : "Create Session"}
        </Text>

        <Flex direction={{ base: "column", lg: "row" }} gap="8">
          <Flex direction="column" gap="6" flex="1">
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Session Name</Text>
              <Input
                value={formData.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                placeholder="e.g. 2024/2025 Academic Session"
                bg="slate.50"
                border="xs"
                borderColor="border.muted"
                borderRadius="md"
              />
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Semesters</Text>
              <Select.Root
                collection={semesterCollection}
                value={[formData.semesters]}
                onValueChange={(e) => handleFormChange("semesters", e.value[0])}
                size="sm"
                width="full"
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select number of semesters" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {semesterCollection.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          {item.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </Box>
            <Box>
              <Flex alignItems="center" gap="2">
                <Checkbox.Root
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(details) => setFormData({ ...formData, isActive: !!details.checked })}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Checkbox.Label fontSize="sm" fontWeight="medium" color="fg.muted">
                    Activate Session
                  </Checkbox.Label>
                </Checkbox.Root>
              </Flex>
            </Box>
          </Flex>
          <Flex direction="column" gap="6" flex="1">
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Duration</Text>
              <Select.Root
                collection={durationCollection}
                value={[formData.duration]}
                onValueChange={(e) => handleFormChange("duration", e.value[0])}
                size="sm"
                width="full"
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select duration" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {durationCollection.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          {item.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Start Date</Text>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleFormChange("startDate", e.target.value)}
                bg="slate.50"
                border="xs"
                borderColor="border.muted"
                borderRadius="md"
              />
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Description</Text>
              <Textarea
                value={formData.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
                rows={3}
                bg="slate.50"
                border="xs"
                borderColor="border.muted"
                borderRadius="md"
              />
            </Box>
          </Flex>
        </Flex>

        <Flex justifyContent="flex-end" gap="3" mt="8">
          <Button
            onClick={() => navigate("/program-courses")}
            px="8"
            py="2.5"
            borderRadius="md"
            fontSize="sm"
            fontWeight="medium"
            variant="outline"
            borderColor="border.muted"
            color="fg.muted"
            _hover={{ bg: "slate.50" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            loading={isSaving}
            loadingText="Saving..."
            px="8"
            py="2.5"
            borderRadius="md"
            fontSize="sm"
            fontWeight="bold"
            bg="#00B01D"
            color="white"
            _hover={{ bg: "green.700" }}
          >
            {isEditingRoute ? "Update Session" : "Create Session"}
          </Button>
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
          <Text color="fg.muted">Loading sessions...</Text>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="8">
      <Flex justifyContent="flex-end" gap="4">
        <Button
          onClick={handleExport}
          variant="outline"
          colorScheme="blue"
          px="5"
          py="2.5"
          borderRadius="md"
          fontSize="sm"
          fontWeight="bold"
        >
        <Download size={18} />  Export table
        </Button>
        <Button
          onClick={() => navigate("/program-courses/sessions/new")}
          colorScheme="blue"
          px="5"
          py="2.5"
          borderRadius="md"
          fontSize="sm"
          fontWeight="bold"
        >
        <Plus />  Create Session
        </Button>
      </Flex>

      <Box bg="white" borderRadius="md" border="xs" borderColor="border.muted">
        <Flex p="6" alignItems="center" gap="4">
          <Text fontSize="lg" fontWeight="bold" color="fg.muted">Created Sessions</Text>
          <InputGroup startElement={<Search />} ml="auto" width="260px">
            <Input
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg="white"
              border="xs"
              borderColor="border.muted"
              borderRadius="md"
              fontSize="xs"
              px="4"
              py="2.5"
            />
          </InputGroup>
        </Flex>

        <Box overflowX="auto">
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="slate.50" borderY="1px solid" borderColor="border.muted">
                <Table.ColumnHeader px="6" py="4" w="12" textAlign="center">
                  <Checkbox.Root
                    checked={sessions.length > 0 && selectedIds.length === sessions.length}
                    onCheckedChange={toggleSelectAll}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                  </Checkbox.Root>
                </Table.ColumnHeader>
                <Table.ColumnHeader px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                  Session Name
                </Table.ColumnHeader>
                <Table.ColumnHeader px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                  Duration
                </Table.ColumnHeader>
                <Table.ColumnHeader px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                  Start Date
                </Table.ColumnHeader>
                <Table.ColumnHeader px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                  Status
                </Table.ColumnHeader>
                <Table.ColumnHeader px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" textAlign="center">
                  Action
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredSessions.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6} style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8" }}>
                    No sessions found
                  </Table.Cell>
                </Table.Row>
              ) : (
                filteredSessions.map((session) => (
                  <Table.Row
                    key={session.id}
                    _hover={{ bg: "slate.50" }}
                    borderBottom="xs"
                    borderColor="border.muted"
                    fontSize="sm"
                    color="fg.muted"
                  >
                    <Table.Cell px="6" py="4" textAlign="center">
                      <Checkbox.Root
                        checked={selectedIds.includes(session.id)}
                        onCheckedChange={() => toggleSelection(session.id)}
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                      </Checkbox.Root>
                    </Table.Cell>
                    <Table.Cell px="6" py="4" fontWeight="medium">{session.name}</Table.Cell>
                    <Table.Cell px="6" py="4">{session.duration}</Table.Cell>
                    <Table.Cell px="6" py="4">{session.startDate}</Table.Cell>
                    <Table.Cell px="6" py="4">
                      <Text
                        as="span"
                        px="4"
                        py="1"
                        borderRadius="full"
                        fontSize="11px"
                        fontWeight="bold"
                        bg={session.isActive ? "green.100" : "gray.100"}
                        color={session.isActive ? "green.600" : "gray.600"}
                      >
                        {session.isActive ? "Active" : "Inactive"}
                      </Text>
                    </Table.Cell>
                    <Table.Cell px="6" py="4" textAlign="center">
                      <Flex justifyContent="center" gap="2">
                        <Button
                          aria-label="Edit session"
                          size="sm"
                          variant="ghost"
                          color="fg.subtle"
                          _hover={{ bg: "fg.subtle" }}
                          onClick={() => navigate(`/program-courses/sessions/edit/${session.id}`)}
                        >
                        <Edit size={16} />    </Button>
                        <Button
                          aria-label="Delete session"
                          size="sm"
                          variant="ghost"
                          color="red.400"
                          _hover={{ bg: "red.50" }}
                          onClick={() => handleDelete(session.id)}
                        >
                       <Trash2 size={16} />     </Button>
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
          borderRadius="md"
          boxShadow="none"
          border="xs"
          borderColor="border.muted"
          alignItems="center"
          gap="6"
          zIndex="50"
        >
          <Text fontSize="sm" fontWeight="bold" color="fg.muted">{selectedIds.length} items selected</Text>
          <Box w="px" h="6" bg="fg.subtle" />
          <Button
            onClick={handleBulkDelete}
            colorScheme="red"
            px="4"
            py="2"
            borderRadius="md"
            fontSize="xs"
            fontWeight="bold"
          >
          <Trash2 size={16} />  Delete
          </Button>
          <Box w="px" h="6" bg="fg.subtle" />
          <Button
            aria-label="Unselect all"
            variant="ghost"
            size="sm"
            color="fg.subtle"
            _hover={{ bg: "fg.subtle" }}
            onClick={() => setSelectedIds([])}
          >
         <X size={20} />   </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default StructureTab;