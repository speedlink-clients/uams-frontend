import { useState, useEffect, useMemo } from "react";
import { Box, Flex, Text, Heading, Icon } from "@chakra-ui/react";
import { Search } from "lucide-react";
import { StudentHook } from "@hooks/student.hook";
import StudentsTable from "@components/shared/StudentsTable";
import type { Student } from "@type/student.type"; 

const LEVEL_OPTIONS = ["All", "100", "200", "300", "400", "500"];
const ITEMS_PER_PAGE = 10;

const Students = () => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [level, setLevel] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, level]);

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

    // Pagination calculations
    const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

    return (
        <Box>
            {/* Page Header */}
            <Box mb="6">
                <Heading size="lg" fontWeight="600" color="#000000" mb="1" fontSize="24px">
                    Students {" "}
                    <Text as="span" fontWeight="400" color="gray.400" fontSize="lg">
                        ({filteredStudents.length} total)
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

            {/* Students Table */}
            <StudentsTable students={paginatedStudents} isLoading={isLoading} />

            {/* Pagination Side */}
            {totalPages > 1 && (
                <Flex alignItems="center" justifyContent="space-between" bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.100" boxShadow="sm" p="4" mt="4">
                    <Text fontSize="sm" color="slate.500">
                        Showing{" "}
                        <Text as="span" fontWeight="semibold">{startIndex + 1}-{Math.min(endIndex, filteredStudents.length)}</Text>
                        {" "}of <Text as="span" fontWeight="semibold">{filteredStudents.length}</Text> students
                        (Total: {students.length})
                    </Text>
                    <Flex alignItems="center" gap="2">
                        <button 
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} 
                            disabled={currentPage === 1} 
                            style={{ 
                                padding: "8px 12px", 
                                background: "white", 
                                border: "1px solid #e2e8f0", 
                                borderRadius: "8px", 
                                fontSize: "14px", 
                                fontWeight: 500, 
                                color: "#334155", 
                                cursor: currentPage === 1 ? "not-allowed" : "pointer", 
                                opacity: currentPage === 1 ? 0.5 : 1 
                            }}
                        >
                            Previous
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            return (
                                <Box as="button" key={pageNum} onClick={() => setCurrentPage(pageNum)} px="3" py="2" borderRadius="lg" fontSize="sm" fontWeight="medium" cursor="pointer" border={currentPage === pageNum ? "none" : "1px solid"} borderColor="slate.200" bg={currentPage === pageNum ? "#1D7AD9" : "white"} color={currentPage === pageNum ? "white" : "slate.700"} _hover={{ bg: currentPage === pageNum ? "#1D7AD9" : "slate.50" }}>
                                    {pageNum}
                                </Box>
                            );
                        })}
                        <button 
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} 
                            disabled={currentPage === totalPages} 
                            style={{ 
                                padding: "8px 12px", 
                                background: "white", 
                                border: "1px solid #e2e8f0", 
                                borderRadius: "8px", 
                                fontSize: "14px", 
                                fontWeight: 500, 
                                color: "#334155", 
                                cursor: currentPage === totalPages ? "not-allowed" : "pointer", 
                                opacity: currentPage === totalPages ? 0.5 : 1 
                            }}
                        >
                            Next
                        </button>
                    </Flex>
                </Flex>
            )}
        </Box>
    );
};

export default Students;