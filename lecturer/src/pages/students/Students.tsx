import { useState, useMemo } from "react";
import { Box, Flex, Text, Heading, Icon } from "@chakra-ui/react";
import { Funnel, Search } from "lucide-react";
import { StudentHook } from "@hooks/student.hook";
import StudentsTable from "@components/shared/StudentsTable";

const LEVEL_OPTIONS = ["All", "100", "200", "300", "400", "500"];

const Students = () => {
    const [search, setSearch] = useState("");
    const [level, setLevel] = useState("All");

    const { data: students, isLoading } = StudentHook.useStudents({ search, level });

    // Client-side search filter (until API handles it)
    const filteredStudents = useMemo(() => {
        if (!students) return [];
        if (!search.trim()) return students;

        const query = search.toLowerCase();
        return students.filter(
            (s) =>
                s.surname.toLowerCase().includes(query) ||
                s.otherNames.toLowerCase().includes(query) ||
                s.email.toLowerCase().includes(query) ||
                s.regNo.toLowerCase().includes(query) ||
                s.matNo.toLowerCase().includes(query)
        );
    }, [students, search]);

    const totalCount = students?.length ?? 0;

    return (
        <Box>
            {/* Page Header */}
            <Box mb="6">
                <Heading size="lg" fontStyle="Semi Bold" fontWeight="600" color="#000000" mb="1" fontSize="24px">
                    Students {" "}
                    <Text as="span" fontWeight="400" color="gray.400" fontSize="lg">
                        ({totalCount})
                    </Text>
                </Heading>
                <Text fontSize="sm" color="gray.500" maxW="400px">
                    This table contains a list of all students to edit, create ID card
                    and assign roles to each
                </Text>
            </Box>

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
                        placeholder="Search by name, email or matNo"
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

                {/* Level Dropdown */}
                <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    style={{
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "white",
                        backgroundColor: "#1273D4",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 16px",
                        cursor: "pointer",
                        outline: "none",
                    }}
                >
                    {LEVEL_OPTIONS.map((opt) => (
                        <option 
                            key={opt} 
                            value={opt}
                            style={{
                                fontSize: "12px",
                                fontWeight: 500,
                                fontFamily: "sans-serif",
                                fontStyle: "Bold",
                                color: "black",
                                backgroundColor: "white",
                                border: "none",
                                borderRadius: "6px",
                                padding: "8px 16px",
                                cursor: "pointer",
                                outline: "none",
                            }}
                        >
                            {opt === "All" ? "Level" : `${opt} Level`}
                        </option>
                    ))}
                </select>

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
                    <Icon as={Funnel} boxSize="3.5" color="gray.600" />
                    <Text fontSize="xs" fontWeight="500" color="gray.700">
                        Filter
                    </Text>
                </Flex>
            </Flex>

            {/* Students Table */}
            <StudentsTable students={filteredStudents} isLoading={isLoading} />
        </Box>
    );
};

export default Students;
