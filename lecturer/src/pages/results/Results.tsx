import { useState } from "react";
import { Box, Flex, Text, Heading } from "@chakra-ui/react";
import { ResultHook } from "@hooks/result.hook";
import ResultCourseList from "@components/shared/ResultCourseList";

const PROGRAM_TYPES = ["All", "Regular", "Part-Time", "Sandwich"];
const LEVELS = ["All", "100", "200", "300", "400", "500"];
const SEMESTERS = ["All", "First Semester", "Second Semester"];

const Results = () => {
    const [programType, setProgramType] = useState("All");
    const [level, setLevel] = useState("All");
    const [semester, setSemester] = useState("All");

    const { data: courses, isLoading } = ResultHook.useResultCourses({
        programType, level, semester,
    });

    return (
        <Box>
            {/* Header */}
            <Heading size="lg" fontWeight="600" color="gray.800" mb="5">
                Results
            </Heading>

            {/* Card */}
            <Box bg="white" borderRadius="lg" border="1px solid" borderColor="gray.100" p="5">
                {/* Sub-header + Filters */}
                <Flex align="center" justify="space-between" mb="4">
                    <Text fontSize="md" fontWeight="600" color="gray.800">
                        List of courses
                    </Text>

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
                                    {s === "All" ? "Select Semester" : s}
                                </option>
                            ))}
                        </select>
                    </Flex>
                </Flex>

                {/* Course List */}
                <ResultCourseList courses={courses ?? []} isLoading={isLoading} />
            </Box>
        </Box>
    );
};

export default Results;
