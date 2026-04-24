import { useState, useMemo } from "react";
import { Box, Flex, Text, Heading, Icon, Select, Portal, createListCollection } from "@chakra-ui/react";
import { Search, X } from "lucide-react";
import { LecturerHook } from "@hooks/lecturer.hook";
import LecturersTable from "@components/shared/LecturersTable";

const Lecturers = () => {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    const { data: lecturers, isLoading } = LecturerHook.useLecturers();

    // Get unique roles from data (excluding null/undefined)
    const uniqueRoles = useMemo(() => {
        if (!lecturers) return [];
        const roles = new Set(
            lecturers
                .map(l => l.currentAdminRole)
                .filter(role => role && role.trim() !== "")
        );
        return Array.from(roles).sort();
    }, [lecturers]);

    // Create collection for Select.Root
    const roleCollection = createListCollection({
        items: uniqueRoles.map(role => ({ label: role, value: role }))
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
            result = result.filter(l => l.currentAdminRole === roleFilter);
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
            <Flex align="center" justify="flex-end" gap="3" mb="5" flexWrap="wrap">
                {/* Search Input */}
                <Flex
                    align="center"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    px="3"
                    py="1.5"
                    w="260px"
                >
                    <Icon as={Search} boxSize="4" color="gray.400" mr="2" />
                    <input
                        placeholder="Search by name, email or code"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            border: "none",
                            outline: "none",
                            fontSize: "12px",
                            width: "100%",
                            background: "transparent",
                            borderRadius: "xl",
                        }}
                    />
                </Flex>

                {/* Role Filter */}
                <Select.Root
                    collection={roleCollection}
                    value={roleFilter ? [roleFilter] : []}
                    onValueChange={(e) => setRoleFilter(e.value[0] || "")}
                    size="sm"
                    width="120px"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="xl"
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="All Roles" />
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
                <Flex
                    align="center"
                    gap="2"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    px="4"
                    py="2"
                    cursor="pointer"
                    _hover={{ bg: "gray.50" }}
                    transition="background 0.15s"
                    onClick={clearFilters}
                >
                    <Icon as={X} boxSize="3.5" color="gray.600" />
                    <Text fontSize="xs" fontWeight="500" color="gray.700">
                        Clear Filters
                    </Text>
                </Flex>
            </Flex>

            {/* Lecturers Table */}
            <LecturersTable lecturers={filteredLecturers} isLoading={isLoading} />
        </Box>
    );
};

export default Lecturers;