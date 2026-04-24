import { useState, useMemo } from "react";
import { Box, Flex, Text, Heading, Icon } from "@chakra-ui/react";
import { Search } from "lucide-react";
import { CourseHook } from "@hooks/course.hook";
import CourseList from "@components/shared/CourseList";

const LEVELS = ["All", "100", "200", "300", "400", "500"];
const SEMESTERS = ["All", "First Semester", "Second Semester"];

const Courses = () => {
    const [search, setSearch] = useState("");
    const [level, setLevel] = useState("All");
    const [semester, setSemester] = useState("All");

    const { data: assignedCourses = [], isLoading } = CourseHook.useAssignedCourses();

    // filtering (search + level + semester)
    const filteredCourses = useMemo(() => {
        let filtered = assignedCourses;

        // Search
        if (search.trim()) {
            const query = search.toLowerCase();
            filtered = filtered.filter(
                (c) =>
                    c.title.toLowerCase().includes(query) ||
                    c.code.toLowerCase().includes(query)
            );
        }

        // Level filter 
        if (level !== "All") {
            filtered = filtered.filter((c) => c.level?.name?.includes(level));
        }

        // Semester filter 
        if (semester !== "All") {
            filtered = filtered.filter((c) => c.semester?.name === semester);
        }

        return filtered;
    }, [assignedCourses, search, level, semester]);

    const totalCount = assignedCourses.length;

    return (
        <Box>
            <Heading size="lg" fontWeight="600" color="#000000" mb="5" fontSize="24px">
                Courses{" "}
                <Text as="span" fontWeight="400" color="gray.400" fontSize="lg">
                    ({totalCount})
                </Text>
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

                    {/* Filters */}
                    <Flex gap="3" flexWrap="wrap">
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
                                    {s === "All" ? "Semester" : s}
                                </option>
                            ))}
                        </select>
                    </Flex>
                </Flex>

                <CourseList courses={filteredCourses} isLoading={isLoading} />
            </Box>
        </Box>
    );
};

export default Courses;