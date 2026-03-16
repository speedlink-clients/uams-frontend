import { useState, useEffect, useMemo } from "react";
import { Box, Flex, Text, Heading, Icon } from "@chakra-ui/react";
import { Search } from "lucide-react";
import { StudentHook } from "@hooks/student.hook";
import StudentsTable from "@components/shared/StudentsTable";
import type { Student } from "@type/student.type"; 

const LEVEL_OPTIONS = ["All", "100", "200", "300", "400", "500"];

const Students = () => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [level, setLevel] = useState("All");


    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    // Fetch all students
    const { data: students = [], isLoading } = StudentHook.useStudents();

    
    const filteredStudents = useMemo(() => {
        if (!students.length) return [];

        return students.filter((student: Student) => {
            
            const matchesLevel = level === "All" || student.level === level;
            
        
            const matchesSearch = !debouncedSearch || 
                student.fullName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                student.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                student.matricNumber?.toLowerCase().includes(debouncedSearch.toLowerCase());
            
            return matchesLevel && matchesSearch;
        });
    }, [students, level, debouncedSearch]);

    const totalCount = filteredStudents.length;

    return (
        <Box>
            {/* Page Header */}
            <Box mb="6">
                <Heading size="lg" fontWeight="600" color="#000000" mb="1" fontSize="24px">
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
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                        padding: "8px 16px",
                        cursor: "pointer",
                        outline: "none",
                        backgroundColor: "white",
                    }}
                >
                    {LEVEL_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt === "All" ? "All Levels" : `${opt} Level`}
                        </option>
                    ))}
                </select>
            </Flex>

            {/* Students Table - Pass filtered students */}
            <StudentsTable students={filteredStudents} isLoading={isLoading} />
        </Box>
    );
};

export default Students;