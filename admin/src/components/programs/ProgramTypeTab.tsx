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
  Field,
  Portal,
  createListCollection,
  Table,
  Dialog,
  EmptyState,
  VStack,
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
      toaster.error({
        title: "Please fill in required fields (Name and Code)",
      });
      return;
    }
    try {
      setIsSaving(true);
      await ProgramServices.createProgramType({
        code: createFormData.code,
        name: createFormData.name,
        type: createFormData.type.toUpperCase(),
      });
      toaster.success({ title: "Program Type created successfully" });
      setCreateFormData({ name: "", code: "", type: "", description: "" });
      setIsCreating(false);
      await fetchProgramTypes();
    } catch (error: any) {
      toaster.error({
        title: error.response?.data?.message || "Failed to create program type",
      });
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
      toaster.error({
        title: error.response?.data?.message || "Failed to update",
      });
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
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === programTypes.length
        ? []
        : programTypes.map((pt) => pt.id),
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} selected program types?`,
      )
    ) {
      try {
        await Promise.all(
          selectedIds.map((id) => ProgramServices.deleteProgramType(id)),
        );
        toaster.success({
          title: `${selectedIds.length} program types deleted`,
        });
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
          <Text color="fg.muted">Loading program types...</Text>
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
            size="xl"
            fontSize="sm"
            fontWeight="bold"
            bg="#1D7AD9"
            color="white"
          >
            <Plus size={16} /> Create Program Type
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
            <Dialog.Content borderRadius="sm" border="xs" borderColor="border.muted" overflow="hidden">
              <Dialog.CloseTrigger />
              <Dialog.Header p="6" borderBottom="xs" borderColor="border.muted">
                <Flex alignItems="center" gap="3">
                  <Flex bg="blue.50" p="2" borderRadius="lg">
                    <GraduationCap size={20} color="#2563eb" />
                  </Flex>
                  <Box>
                    <Dialog.Title
                      fontSize="lg"
                      fontWeight="bold"
                      color="fg.muted"
                    >
                      Create Program Type
                    </Dialog.Title>
                    <Text fontSize="sm" color="fg.muted" mt="1">
                      Add a new program type to the system (e.g., Bachelor of
                      Science, Master of Arts)
                    </Text>
                  </Box>
                </Flex>
              </Dialog.Header>
              <Dialog.Body p="8">
                <Flex direction="column" gap="6">
                  <Flex gap="4">
                    <Field.Root flex="6.5">
                      <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Name</Field.Label>
                      <Input
                        value={createFormData.name}
                        onChange={(e) =>
                          setCreateFormData((p) => ({
                            ...p,
                            name: e.target.value,
                          }))
                        }
                        placeholder="e.g. Bachelor of Science"
                        size="xl"
                        _placeholder={{ color: "fg.subtle" }}
                      />
                    </Field.Root>
                    <Field.Root flex="3.5">
                      <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Code</Field.Label>
                      <Input
                        value={createFormData.code}
                        onChange={(e) =>
                          setCreateFormData((p) => ({
                            ...p,
                            code: e.target.value,
                          }))
                        }
                        placeholder="e.g. BSC"
                        size="xl"
                        _placeholder={{ color: "fg.subtle" }}
                      />
                    </Field.Root>
                  </Flex>

                  <Flex gap="4">
                    <Field.Root flex="1">
                      <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Type</Field.Label>
                      <Select.Root
                        collection={typeCollection}
                        value={createFormData.type ? [createFormData.type] : []}
                        onValueChange={(e) =>
                          setCreateFormData((p) => ({ ...p, type: e.value[0] }))
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
                              {typeCollection.items.map((item: any) => (
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
                      <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Description</Field.Label>
                      <Textarea
                        value={createFormData.description}
                        onChange={(e) =>
                          setCreateFormData((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                        rows={1}
                        size="xl"
                        placeholder="Optional description"
                        _placeholder={{ color: "fg.subtle" }}
                      />
                    </Field.Root>
                  </Flex>
                </Flex>
              </Dialog.Body>
              <Dialog.Footer p="6" borderTop="xs" borderColor="border.muted" gap="3">
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    borderColor="border.muted"
                    color="fg.muted"
                    px="8"
                    fontWeight="bold"
                    fontSize="sm"
                  >
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  onClick={handleCreate}
                  loading={isSaving}
                  loadingText="Creating..."
                  bg="accent.500"
                  color="white"
                  px="10"
                  fontWeight="bold"
                  fontSize="sm"
                >
                  <Plus size={16} /> Create Program Type
                </Button>
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
            <Dialog.Content borderRadius="sm" border="xs" borderColor="border.muted" overflow="hidden">
              <Dialog.CloseTrigger />
              <Dialog.Header p="6" borderBottom="xs" borderColor="border.muted">
                <Flex alignItems="center" gap="3">
                  <Flex bg="blue.50" p="2" borderRadius="lg">
                    <GraduationCap size={20} color="#2563eb" />
                  </Flex>
                  <Box>
                    <Dialog.Title fontSize="lg" fontWeight="bold" color="fg.muted">
                      Edit Program Type
                    </Dialog.Title>
                    <Text fontSize="sm" color="fg.muted" mt="1">
                      Update the details of the existing program type.
                    </Text>
                  </Box>
                </Flex>
              </Dialog.Header>
              <Dialog.Body p="8">
                <Flex direction="column" gap="6">
                  <Flex gap="4">
                    <Field.Root flex="6.5">
                      <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Name</Field.Label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="e.g. Bachelor of Science"
                        size="xl"
                        _placeholder={{ color: "fg.subtle" }}
                      />
                    </Field.Root>
                    <Field.Root flex="3.5">
                      <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Code</Field.Label>
                      <Input
                        value={formData.code}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, code: e.target.value }))
                        }
                        placeholder="e.g. BSC"
                        size="xl"
                        _placeholder={{ color: "fg.subtle" }}
                      />
                    </Field.Root>
                  </Flex>

                  <Flex gap="4">
                    <Field.Root flex="1">
                      <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Type</Field.Label>
                      <Select.Root
                        collection={typeCollection}
                        value={formData.type ? [formData.type] : []}
                        onValueChange={(e) =>
                          setFormData((p) => ({ ...p, type: e.value[0] }))
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
                              {typeCollection.items.map((item: any) => (
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
                      <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Description</Field.Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                        rows={1}
                        size="xl"
                        placeholder="Optional description"
                        _placeholder={{ color: "fg.subtle" }}
                      />
                    </Field.Root>
                  </Flex>
                </Flex>
              </Dialog.Body>
              <Dialog.Footer p="6" borderTop="xs" borderColor="border.muted" gap="3">
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    borderColor="border.muted"
                    color="fg.muted"
                    px="8"
                    fontWeight="bold"
                    fontSize="sm"
                  >
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  onClick={handleSave}
                  loading={isSaving}
                  loadingText="Saving..."
                  bg="accent.500"
                  color="white"
                  px="10"
                  fontWeight="bold"
                  fontSize="sm"
                >
                  Save Changes
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Table */}
      <Box bg="white" borderRadius="md" border="xs" borderColor="border.muted" overflow="hidden">
        <Box p="6" borderBottom="1px solid" borderColor="border.muted">
          <Text fontSize="lg" fontWeight="bold" color="fg.muted">
            Program Types ({programTypes.length})
          </Text>
        </Box>
        <Box overflowX="auto">
          <Table.Root size="sm" variant="outline" border="none">
            <Table.Header bg="slate.50">
              <Table.Row borderColor="border.muted">
                <Table.ColumnHeader px="6" py="4" w="12" textAlign="center">
                  <Checkbox
                    checked={
                      programTypes.length > 0 &&
                      selectedIds.length === programTypes.length
                    }
                    onCheckedChange={toggleSelectAll}
                    cursor="pointer"
                  />
                </Table.ColumnHeader>
                <Table.ColumnHeader px="6" py="4" fontSize="11px" fontWeight="semibold" color="fg.muted" textTransform="uppercase">S/N</Table.ColumnHeader>
                <Table.ColumnHeader px="6" py="4" fontSize="11px" fontWeight="semibold" color="fg.muted" textTransform="uppercase">NAME</Table.ColumnHeader>
                <Table.ColumnHeader px="6" py="4" fontSize="11px" fontWeight="semibold" color="fg.muted" textTransform="uppercase">CODE</Table.ColumnHeader>
                <Table.ColumnHeader px="6" py="4" fontSize="11px" fontWeight="semibold" color="fg.muted" textTransform="uppercase">TYPE</Table.ColumnHeader>
                <Table.ColumnHeader px="6" py="4" fontSize="11px" fontWeight="semibold" color="fg.muted" textTransform="uppercase" textAlign="center">ACTIONS</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {programTypes.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6} py="12">
                    <EmptyState.Root>
                      <EmptyState.Content>
                        <EmptyState.Indicator>
                          <GraduationCap size={40} />
                        </EmptyState.Indicator>
                        <VStack textAlign="center">
                          <EmptyState.Title>
                            No Program Types Found
                          </EmptyState.Title>
                          <EmptyState.Description>
                            Add a new program type to start organizing your
                            academic structure.
                          </EmptyState.Description>
                          <Button
                            onClick={() => setIsCreating(true)}
                            bg="#1D7AD9"
                            color="white"
                            size="sm"
                            mt="4"
                            fontWeight="bold"
                          >
                            <Plus size={16} /> Create Program Type
                          </Button>
                        </VStack>
                      </EmptyState.Content>
                    </EmptyState.Root>
                  </Table.Cell>
                </Table.Row>
              ) : (
                programTypes.map((pt, index) => (
                  <Table.Row
                    key={pt.id}
                    bg={selectedIds.includes(pt.id) ? "blue.50" : undefined}
                    _hover={{ bg: "slate.50" }}
                    borderColor="border.muted"
                    fontSize="sm"
                    color="fg.muted"
                  >
                    <Table.Cell px="6" py="4" textAlign="center">
                      <Checkbox
                        checked={selectedIds.includes(pt.id)}
                        onCheckedChange={() => toggleSelection(pt.id)}
                        cursor="pointer"
                      />
                    </Table.Cell>
                    <Table.Cell px="6" py="4">{index + 1}</Table.Cell>
                    <Table.Cell px="6" py="4" fontWeight="medium">{pt.name}</Table.Cell>
                    <Table.Cell px="6" py="4">{pt.code || "—"}</Table.Cell>
                    <Table.Cell px="6" py="4">{pt.type || "—"}</Table.Cell>
                    <Table.Cell px="6" py="4" textAlign="center">
                      <Flex justifyContent="center" gap="2">
                        <Button
                          aria-label="Edit"
                          size="sm"
                          variant="ghost"
                          color="fg.subtle"
                          _hover={{ bg: "fg.subtle" }}
                          onClick={() => handleEdit(pt)}
                          borderRadius="full"
                          minW="auto"
                          p="1"
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
                          borderRadius="full"
                          minW="auto"
                          p="1"
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
          <Text fontSize="sm" fontWeight="bold" color="fg.muted">
            {selectedIds.length} items selected
          </Text>
          <Box w="px" h="6" bg="fg.subtle" />
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
          <Box w="px" h="6" bg="fg.subtle" />
          <Button
            aria-label="Unselect all"
            variant="ghost"
            size="sm"
            color="fg.subtle"
            _hover={{ bg: "fg.subtle" }}
            onClick={() => setSelectedIds([])}
          >
            <X size={20} />
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default ProgramTypeTab;
