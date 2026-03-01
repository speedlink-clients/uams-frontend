import { useState, useMemo } from "react";
import { Box, Flex, Text, Heading, Icon } from "@chakra-ui/react";
import { Search, SlidersHorizontal } from "lucide-react";
import { LecturerHook } from "@hooks/lecturer.hook";
import LecturersTable from "@components/shared/LecturersTable";

const Lecturers = () => {
    const [search, setSearch] = useState("");

    const { data: lecturers, isLoading } = LecturerHook.useLecturers();

    // Client-side search filter
    const filteredLecturers = useMemo(() => {
        if (!lecturers) return [];
        if (!search.trim()) return lecturers;

        const query = search.toLowerCase();
        return lecturers.filter(
            (l) =>
                l.staffNumber?.toLowerCase()?.includes(query) ||
                l.User?.fullName?.toLowerCase()?.includes(query) ||
                l.User?.email?.toLowerCase()?.includes(query) ||
                l.User?.phone?.toLowerCase()?.includes(query) ||
                l.specialization?.toLowerCase()?.includes(query) ||
                l.additionalRoles?.join(", ")?.toLowerCase().includes(query)
        );
    }, [lecturers, search]);

    const totalCount = lecturers?.length ?? 0;

    return (
        <Box>
            {/* Page Header */}
            <Heading size="lg" fontWeight="600" color="#000000" mb="6" fontSize="24px">
                Lecturers{" "}
                <Text as="span" fontWeight="400" color="gray.400" fontSize="lg">
                    ({totalCount})
                </Text>
            </Heading>

            {/* Toolbar */}
            <Flex align="center" justify="flex-end" gap="3" mb="5">
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
                        }}
                    />
                </Flex>

                {/* Filter Button */}
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
                >
                    <Icon as={SlidersHorizontal} boxSize="3.5" color="gray.600" />
                    <Text fontSize="xs" fontWeight="500" color="gray.700">
                        Filter
                    </Text>
                </Flex>
            </Flex>

            {/* Lecturers Table */}
            <LecturersTable lecturers={filteredLecturers} isLoading={isLoading} />
        </Box>
    );
};

export default Lecturers;
