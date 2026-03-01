import { useState, useMemo } from "react";
import { Box, Flex, Text, Heading, Icon } from "@chakra-ui/react";
import { ChevronRight, Search } from "lucide-react";
import { CourseHook } from "@hooks/course.hook";
import { useNavigate } from "react-router";

const PROGRAM_TYPES = ["All", "Regular", "Part-Time", "Sandwich"];
const LEVELS = ["All", "100", "200", "300", "400", "500"];
const SEMESTERS = ["All", "First Semester", "Second Semester"];

const Results = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [programType, setProgramType] = useState("All");
    const [level, setLevel] = useState("All");
    const [semester, setSemester] = useState("All");

    const { data: courses, isLoading } = CourseHook.useCourses({
        search, programType, level, semester,
    });

    const filteredCourses = useMemo(() => {
        if (!courses) return [];
        if (!search.trim()) return courses;
        const query = search.toLowerCase();
        return courses.filter(
            (c) =>
                c.title.toLowerCase().includes(query) ||
                c.code.toLowerCase().includes(query)
        );
    }, [courses, search]);

    if(isLoading) return <Text>Loading courses...</Text>

    // const totalCount = courses?.length ?? 0;

    return (
        <Box>
            {/* Header */}
            <Heading size="lg" fontWeight="600" color="#000000" mb="5" fontSize="24px">
                Results{" "}
                {/* <Text as="span" fontWeight="400" color="gray.400" fontSize="lg">
                    ({totalCount})
                </Text> */}
            </Heading>

            {/* Toolbar */}
            <Box
                bg="white"
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.100"
                p="5"
            >
                <Flex align="center" justify="space-between" mb="5">
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

                    {/* Filters */}
                    <Flex gap="3">
                        <select
                            value={programType}
                            onChange={(e) => setProgramType(e.target.value)}
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
                            {PROGRAM_TYPES.map((t) => (
                                <option key={t} value={t}>
                                    {t === "All" ? "Program Type" : t}
                                </option>
                            ))}
                        </select>

                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
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
                            {LEVELS.map((l) => (
                                <option key={l} value={l}>
                                    {l === "All" ? "Level" : `${l} Level`}
                                </option>
                            ))}
                        </select>

                        <select
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
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
                            {SEMESTERS.map((s) => (
                                <option key={s} value={s}>
                                    {s === "All" ? "First Semester" : s}
                                </option>
                            ))}
                        </select>
                    </Flex>
                </Flex>

                {/* Course List */}
                <Box bg="white" borderRadius="lg" border="1px solid" borderColor="gray.100">
                    {/* Table Header */}
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

                    {/* Course Rows */}
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
