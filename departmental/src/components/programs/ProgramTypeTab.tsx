import { useState, useEffect } from "react";
import { ProgramServices } from "@services/program.service";
import { toaster } from "@components/ui/toaster";
import {
  Box,
  Flex,
  Text,
  Input,
  Spinner,
  Textarea,
  Button,
  Select,
  Portal,
  createListCollection,
  IconButton,
  Table,
  Dialog,
} from "@chakra-ui/react";
import { Edit, Trash2, X, Plus, GraduationCap } from "lucide-react";
import { Checkbox } from "@components/ui/checkbox";

const typeCollection = createListCollection({
  items: [
    { label: "Diploma", value: "DIPLOMA" },
    { label: "Undergraduate", value: "UNDERGRADUATE" },
    { label: "Postgraduate", value: "POSTGRADUATE" },
    { label: "Sandwich", value: "SANDWICH" },
  ],
});

const ProgramTypeTab = () => {
  const [programTypes, setProgramTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "UNDERGRADUATE",
    description: "",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: "",
    code: "",
    type: "",
    description: "",
  });

  useEffect(() => {
    fetchProgramTypes();
  }, []);

  const fetchProgramTypes = async () => {
    try {
      setIsLoading(true);
      const data = await ProgramServices.getProgramTypes();
      const list = Array.isArray(data) ? data : (data as any)?.data || [];
      setProgramTypes(list);
    } catch (err) {
      toaster.error({ title: "Failed to load program types" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (pt: any) => {
    setEditingId(pt.id);
    setFormData({
      name: pt.name,
      code: pt.code || "",
      type: pt.type || "UNDERGRADUATE",
      description: pt.description || "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "", code: "", type: "UNDERGRADUATE", description: "" });
  };

  const handleCreate = async () => {
    if (!createFormData.name || !createFormData.code) {
      toaster.error({ title: "Please fill in required fields (Name and Code)" });
      return;
    }
    try {
      setIsSaving(true);
      await ProgramServices.createProgramType({
        ...createFormData,
        type: createFormData.type.toUpperCase(),
      });
      toaster.success({ title: "Program Type created successfully" });
      setCreateFormData({ name: "", code: "", type: "", description: "" });
      setIsCreating(false);
      await fetchProgramTypes();
    } catch (error: any) {
      toaster.error({ title: error.response?.data?.message || "Failed to create program type" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelCreate = () => {
    setCreateFormData({ name: "", code: "", type: "", description: "" });
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!editingId) return;
    try {
      setIsSaving(true);
      await ProgramServices.updateProgramType(editingId, formData);
      toaster.success({ title: "Program type updated" });
      handleCancel();
      await fetchProgramTypes();
    } catch (error: any) {
      toaster.error({ title: error.response?.data?.message || "Failed to update" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this program type?")) {
      try {
        await ProgramServices.deleteProgramType(id);
        toaster.success({ title: "Program type deleted" });
        await fetchProgramTypes();
      } catch (err) {
        toaster.error({ title: "Failed to delete" });
      }
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === programTypes.length
        ? []
        : programTypes.map((pt) => pt.id)
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected program types?`)) {
      try {
        await Promise.all(selectedIds.map((id) => ProgramServices.deleteProgramType(id)));
        toaster.success({ title: `${selectedIds.length} program types deleted` });
        setSelectedIds([]);
        await fetchProgramTypes();
      } catch (err) {
        toaster.error({ title: "Failed to delete some program types" });
      }
    }
  };

  if (isLoading) {
    return (
      <Flex alignItems="center" justifyContent="center" minH="400px">
        <Flex direction="column" alignItems="center" gap="4">
          <Spinner size="xl" color="blue.500" borderWidth="3px" />
          <Text color="slate.500">Loading program types...</Text>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="8">
      {/* Create Form Toggle */}
      {!isCreating && !editingId && (
        <Flex justifyContent="flex-end">
          <Button
            onClick={() => setIsCreating(true)}
            px="5"
            py="2.5"
            borderRadius="lg"
            fontSize="sm"
            fontWeight="bold"
            bg="#1D7AD9"
            color="white"
          >
          <Plus size={16} />  Create Program Type
          </Button>
        </Flex>
      )}

      {/* Create Form Dialog */}
      <Dialog.Root
        open={isCreating}
        onOpenChange={(e) => {
          setIsCreating(e.open);
          if (!e.open) handleCancelCreate();
        }}
        size="xl"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="2xl" overflow="hidden">
              <Dialog.CloseTrigger />
              <Dialog.Header p="6" borderBottom="1px solid" borderColor="gray.100">
                <Flex alignItems="center" gap="3">
                  <Flex bg="blue.50" p="2" borderRadius="lg">
                    <GraduationCap size={20} color="#2563eb" />
                  </Flex>
                  <Box>
                    <Dialog.Title fontSize="lg" fontWeight="bold" color="slate.800">
                      Create Program Type
                    </Dialog.Title>
                    <Text fontSize="sm" color="slate.500" mt="1">
                      Add a new program type to the system (e.g., Bachelor of Science, Master of Arts)
                    </Text>
                  </Box>
                </Flex>
              </Dialog.Header>
              <Dialog.Body p="8">
                <Flex direction={{ base: "column", lg: "row" }} gap="8">
                  <Flex direction="column" gap="6" flex="1">
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">
                        Name
                      </Text>
                      <Input
                        value={createFormData.name}
                        onChange={(e) => setCreateFormData((p) => ({ ...p, name: e.target.value }))}
                        placeholder="e.g. Bachelor of Science"
                        bg="slate.50"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                      />
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">
                        Code
                      </Text>
                      <Input
                        value={createFormData.code}
                        onChange={(e) => setCreateFormData((p) => ({ ...p, code: e.target.value }))}
                        placeholder="e.g. BSC"
                        bg="slate.50"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                      />
                    </Box>
                  </Flex>
                  <Flex direction="column" gap="6" flex="1">
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">
                        Type
                      </Text>
                      <Select.Root
                        collection={typeCollection}
                        value={createFormData.type ? [createFormData.type] : []}
                        onValueChange={(e) =>
                          setCreateFormData((p) => ({ ...p, type: e.value[0] }))
                        }
                        size="sm"
                        width="full"
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
                              {typeCollection.items.map((item) => (
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
                      <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">
                        Description
                      </Text>
                      <Textarea
                        value={createFormData.description}
                        onChange={(e) => setCreateFormData((p) => ({ ...p, description: e.target.value }))}
                        rows={3}
                        bg="slate.50"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                        placeholder="Optional description"
                      />
                    </Box>
                  </Flex>
                </Flex>
              </Dialog.Body>
              <Dialog.Footer p="6" pt="0" borderTop="1px solid" borderColor="gray.100" mt="4">
                <Flex wrap="wrap" justifyContent="flex-end" gap="3" w="full" pt="4">
                  <Button
                    onClick={handleCancelCreate}
                    variant="outline"
                    borderColor="#1D7AD9"
                    color="#1D7AD9"
                    px="8"
                    py="2.5"
                    borderRadius="lg"
                    fontSize="sm"
                    fontWeight="medium"
                    _hover={{ bg: "blue.50" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreate}
                    loading={isSaving}
                    loadingText="Creating..."
                    px="8"
                    py="2.5"
                    borderRadius="lg"
                    fontSize="sm"
                    fontWeight="bold"
                    bg="#1D7AD9"
                    color="white"
                  >
                    <Plus size={16} />  Create Program Type
                  </Button>
                </Flex>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Edit Form Dialog */}
      <Dialog.Root
        open={!!editingId}
        onOpenChange={(e) => {
          if (!e.open) handleCancel();
        }}
        size="xl"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="2xl" overflow="hidden">
              <Dialog.CloseTrigger />
              <Dialog.Header p="6" borderBottom="1px solid" borderColor="gray.100">
                <Dialog.Title fontSize="lg" fontWeight="bold" color="slate.800">
                  Edit Program Type
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body p="8">
                <Flex gap="6" direction={{ base: "column", lg: "row" }}>
                  <Flex direction="column" gap="6" flex="1">
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">
                        Name
                      </Text>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        placeholder="e.g. Bachelor of Science"
                        bg="slate.50"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                      />
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">
                        Code
                      </Text>
                      <Input
                        value={formData.code}
                        onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
                        placeholder="e.g. UG"
                        bg="slate.50"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                      />
                    </Box>
                  </Flex>
                  <Flex direction="column" gap="6" flex="1">
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">
                        Type
                      </Text>
                      <Select.Root
                        collection={typeCollection}
                        value={[formData.type]}
                        onValueChange={(e) => setFormData((p) => ({ ...p, type: e.value[0] }))}
                        size="sm"
                        width="full"
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
                              {typeCollection.items.map((item) => (
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
                      <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">
                        Description
                      </Text>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                        rows={3}
                        bg="slate.50"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                      />
                    </Box>
                  </Flex>
                </Flex>
              </Dialog.Body>
              <Dialog.Footer p="6" pt="0" borderTop="1px solid" borderColor="gray.100" mt="4">
                <Flex justifyContent="flex-end" gap="3" w="full" pt="4">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    borderColor="slate.300"
                    color="slate.600"
                    px="6"
                    py="2"
                    borderRadius="lg"
                    fontSize="sm"
                    _hover={{ bg: "slate.50" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    loading={isSaving}
                    loadingText="Saving..."
                    px="6"
                    py="2"
                    borderRadius="lg"
                    fontSize="sm"
                    fontWeight="bold"
                    bg="#00B01D"
                    color="white"
                    disabled={!formData.name || !formData.code}
                  >
                    Update Program Type
                  </Button>
                </Flex>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Table */}
      <Box bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.100" boxShadow="sm">
        <Box p="6">
          <Text fontSize="lg" fontWeight="bold" color="slate.800">
            Program Types ({programTypes.length})
          </Text>
        </Box>
        <Table.ScrollArea>
          <Table.Root size="sm" variant="outline">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader w="12" textAlign="center">
                  <Checkbox
                    checked={programTypes.length > 0 && selectedIds.length === programTypes.length}
                    onCheckedChange={toggleSelectAll}
                    cursor="pointer"
                  />
                </Table.ColumnHeader>
                <Table.ColumnHeader>S/N</Table.ColumnHeader>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>Code</Table.ColumnHeader>
                <Table.ColumnHeader>Type</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">Action</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {programTypes.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6} textAlign="center" py="10" color="gray.500">
                    No program types found
                  </Table.Cell>
                </Table.Row>
              ) : (
                programTypes.map((pt, index) => (
                  <Table.Row
                    key={pt.id}
                    bg={selectedIds.includes(pt.id) ? "blue.50" : undefined}
                    _hover={{ bg: "slate.50" }}
                  >
                    <Table.Cell textAlign="center">
                      <Checkbox
                        checked={selectedIds.includes(pt.id)}
                        onCheckedChange={() => toggleSelection(pt.id)}
                        cursor="pointer"
                      />
                    </Table.Cell>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell fontWeight="medium">{pt.name}</Table.Cell>
                    <Table.Cell>{pt.code || "—"}</Table.Cell>
                    <Table.Cell>{pt.type || "—"}</Table.Cell>
                    <Table.Cell textAlign="center">
                      <Flex justifyContent="center" gap="2">
                        <Button
                          aria-label="Edit"
                          size="sm"
                          variant="ghost"
                          color="slate.400"
                          _hover={{ bg: "slate.100" }}
                          onClick={() => handleEdit(pt)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          aria-label="Delete"
                          size="sm"
                          variant="ghost"
                          color="red.400"
                          _hover={{ bg: "red.50" }}
                          onClick={() => handleDelete(pt.id)}
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
        </Table.ScrollArea>
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
          border="1px solid"
          borderColor="gray.100"
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
          <Trash2 size={16} />  Delete
          </Button>
          <Box w="px" h="6" bg="slate.200" />
          <Button
            aria-label="Unselect all"
            variant="ghost"
            size="sm"
            color="slate.400"
            _hover={{ bg: "slate.100" }}
            onClick={() => setSelectedIds([])}
          >
            <X size={20} />
          </IconButton>
        </Flex>
      )}
    </Flex>
  );
};

export default ProgramTypeTab;