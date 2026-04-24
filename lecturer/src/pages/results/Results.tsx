import { useState, useMemo } from "react";
import { Box, Flex, Text, Heading, Icon } from "@chakra-ui/react";
import { ChevronRight, Search } from "lucide-react";
import { CourseHook } from "@hooks/course.hook";
import { useNavigate } from "react-router";

const Results = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [selectedLevelId, setSelectedLevelId] = useState<string>("all");
    const [selectedSemesterId, setSelectedSemesterId] = useState<string>("all");

    // Fetch only assigned courses
    const { data: assignedCourses = [], isLoading } = CourseHook.useAssignedCourses();

    // Extract unique level options from assigned courses
    const levelOptions = useMemo(() => {
        const levelsMap = new Map<string, string>();
        assignedCourses.forEach(course => {
            if (course.level?.id && course.level?.name) {
                levelsMap.set(course.level.id, course.level.name);
            }
        });
        return Array.from(levelsMap.entries()).map(([id, name]) => ({ id, name }));
    }, [assignedCourses]);

    // Extract unique semester options from assigned courses
    const semesterOptions = useMemo(() => {
        const semestersMap = new Map<string, string>();
        assignedCourses.forEach(course => {
            if (course.semester?.id && course.semester?.name) {
                semestersMap.set(course.semester.id, course.semester.name);
            }
        });
        return Array.from(semestersMap.entries()).map(([id, name]) => ({ id, name }));
    }, [assignedCourses]);

    // Apply search + level + semester filters
    const filteredCourses = useMemo(() => {
        let filtered = assignedCourses;

        // Search filter
        if (search.trim()) {
            const query = search.toLowerCase();
            filtered = filtered.filter(
                (c) =>
                    c.title.toLowerCase().includes(query) ||
                    c.code.toLowerCase().includes(query)
            );
        }

        // Level filter (by levelId)
        if (selectedLevelId !== "all") {
            filtered = filtered.filter((c) => c.levelId === selectedLevelId);
        }

        // Semester filter (by semesterId)
        if (selectedSemesterId !== "all") {
            filtered = filtered.filter((c) => c.semesterId === selectedSemesterId);
        }

        return filtered;
    }, [assignedCourses, search, selectedLevelId, selectedSemesterId]);

    if (isLoading) return <Text>Loading courses...</Text>;

    return (
        <Box>
            <Heading size="lg" fontWeight="600" color="#000000" mb="5" fontSize="24px">
                Results
            </Heading>

            <Box bg="white" borderRadius="lg" border="1px solid" borderColor="gray.100" p="5">
                <Flex align="center" justify="space-between" mb="5" flexWrap="wrap" gap="4">
                    {/* Search */}
                    <Flex
                        align="center"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        px="3"
                        py="1.5"
                        w="300px"
                    >
                        <input
                            placeholder="Search Course"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                border: "none",
                                outline: "none",
                                fontSize: "13px",
                                width: "100%",
                                background: "transparent",
                            }}
                        />
                        <Icon as={Search} boxSize="4" color="gray.400" ml="2" />
                    </Flex>

                    {/* Level & Semester Filters */}
                    <Flex gap="3" flexWrap="wrap">
                        {/* Level Filter */}
                        <select
                            value={selectedLevelId}
                            onChange={(e) => setSelectedLevelId(e.target.value)}
                            style={{
                                fontSize: "12px",
                                fontWeight: 500,
                                color: "#4A5568",
                                border: "1px solid #E2E8F0",
                                borderRadius: "6px",
                                padding: "8px 12px",
                                cursor: "pointer",
                                outline: "none",
                                background: "white",
                            }}
                        >
                            <option value="all">All Levels</option>
                            {levelOptions.map((level) => (
                                <option key={level.id} value={level.id}>
                                    {level.name}
                                </option>
                            ))}
                        </select>

                        {/* Semester Filter */}
                        <select
                            value={selectedSemesterId}
                            onChange={(e) => setSelectedSemesterId(e.target.value)}
                            style={{
                                fontSize: "12px",
                                fontWeight: 500,
                                color: "#4A5568",
                                border: "1px solid #E2E8F0",
                                borderRadius: "6px",
                                padding: "8px 12px",
                                cursor: "pointer",
                                outline: "none",
                                background: "white",
                            }}
                        >
                            <option value="all">All Semesters</option>
                            {semesterOptions.map((sem) => (
                                <option key={sem.id} value={sem.id}>
                                    {sem.name}
                                </option>
                            ))}
                        </select>
                    </Flex>
                </Flex>

                {/* Course List Table */}
                <Box bg="white" borderRadius="lg" border="1px solid" borderColor="gray.100">
                    <Flex
                        px="6"
                        py="3"
                        borderBottom="1px solid"
                        borderColor="gray.100"
                        bg="gray.50"
                    >
                        <Text fontSize="xs" fontWeight="600" color="gray.600" w="60px">S/N</Text>
                        <Text fontSize="xs" fontWeight="600" color="gray.600" w="120px">Code</Text>
                        <Text fontSize="xs" fontWeight="600" color="gray.600" flex="1">Course Title</Text>
                        <Box w="30px" />
                    </Flex>

                    {filteredCourses.map((course, index) => (
                        <Flex
                            key={course.id}
                            align="center"
                            px="6"
                            py="4"
                            borderBottom="1px solid"
                            borderColor="gray.50"
                            cursor="pointer"
                            _hover={{ bg: "gray.50" }}
                            transition="background 0.15s"
                            onClick={() => navigate(`/results/${course.id}`, { state: { course } })}
                        >
                            <Text fontSize="xs" color="gray.600" w="60px">{index + 1}</Text>
                            <Text fontSize="xs" color="gray.700" w="120px">{course.code}</Text>
                            <Text fontSize="xs" color="gray.700" flex="1">{course.title}</Text>
                            <Box w="30px" textAlign="right">
                                <ChevronRight size={14} color="#A0AEC0" />
                            </Box>
                        </Flex>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default Results;