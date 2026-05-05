import { useState, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  Select,
  Portal,
  createListCollection,
  InputGroup,
  Input,
  Button,  
} from "@chakra-ui/react";
import { LecturerHook } from "@hooks/lecturer.hook";
import LecturersTable from "@components/shared/LecturersTable";
import { LuSearch, LuX } from "react-icons/lu";

const Lecturers = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const { data: lecturers, isLoading } = LecturerHook.useLecturers();

  // Get unique roles from data (excluding null/undefined)
  const uniqueRoles = useMemo(() => {
    if (!lecturers) return [];
    const roles = new Set(
      lecturers
        .map((l) => l.currentAdminRole)
        .filter((role) => role && role.trim() !== "")
    );
    return Array.from(roles).sort();
  }, [lecturers]);

  // Create collection for Select.Root
  const roleCollection = createListCollection({
    items: uniqueRoles.map((role) => ({ label: role, value: role })),
  });

  // Client-side search + role filter
  const filteredLecturers = useMemo(() => {
    if (!lecturers) return [];

    let result = lecturers;

    // Apply search filter
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.staffNumber?.toLowerCase()?.includes(query) ||
          l.User?.fullName?.toLowerCase()?.includes(query) ||
          l.User?.email?.toLowerCase()?.includes(query) ||
          l.User?.phone?.toLowerCase()?.includes(query) ||
          l.specialization?.toLowerCase()?.includes(query) ||
          l.additionalRoles?.join(", ")?.toLowerCase().includes(query)
      );
    }

    // Apply role filter
    if (roleFilter) {
      result = result.filter((l) => l.currentAdminRole === roleFilter);
    }

    return result;
  }, [lecturers, search, roleFilter]);

  const totalCount = lecturers?.length ?? 0;
  const filteredCount = filteredLecturers.length;

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setRoleFilter("");
  };

   const hasNoRoles = uniqueRoles.length === 0;

  return (
    <Box>
      {/* Page Header */}
      <Heading size="lg" fontWeight="600" color="#000000" mb="6" fontSize="24px">
        Lecturers{" "}
        <Text as="span" fontWeight="400" color="gray.400" fontSize="lg">
          ({filteredCount} / {totalCount})
        </Text>
      </Heading>

      {/* Toolbar */}
      <Flex align="center" justify="flex-end" gap="3" mb="5">
        <InputGroup startElement={<LuSearch />}>
          <Input
            placeholder="Search by Name, Email or Code"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fontSize="12px"
            width="260px"
          />
        </InputGroup>

        {/* Role Filter */}
        <Select.Root
          collection={roleCollection}
          value={roleFilter ? [roleFilter] : []}
          onValueChange={(e) => setRoleFilter(e.value[0] || "")}
          size="md"
          width="120px"
          disabled={hasNoRoles}
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder={hasNoRoles ? "No Roles" : "All Roles"} />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {roleCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>

        {/* Clear Filters Button */}
        <Button
          onClick={clearFilters}
          size="md"
          variant="outline"
          borderColor="gray.200"
          bg="white"
          color="gray.700"
          fontWeight="500"
          fontSize="xs"
          _hover={{ bg: "gray.50" }}
        >
        <LuX />  Clear Filters
        </Button>
      </Flex>

      {/* Lecturers Table */}
      <LecturersTable lecturers={filteredLecturers} isLoading={isLoading} />
    </Box>
  );
};

export default Lecturers;