import { Box, Flex, Text, Grid } from "@chakra-ui/react";
import { User } from "lucide-react";
import type { Course, CourseLecturer } from "@type/course.type";
import type { AttendanceDataPoint } from "@type/dashboard.type";
import AttendanceChart from "@components/shared/AttendanceChart";
import { useState } from "react";

interface CourseInfoPanelProps {
    course: Course;
    lecturers: CourseLecturer[];
}

// Mock attendance data for the chart
const MOCK_ATTENDANCE: AttendanceDataPoint[] = [
    { courseCode: "Jan", attendance: 60 },
    { courseCode: "Feb", attendance: 80 },
    { courseCode: "Mar", attendance: 70 },
    { courseCode: "Apr", attendance: 90 },
    { courseCode: "May", attendance: 75 },
    { courseCode: "Jun", attendance: 95 },
    { courseCode: "Jul", attendance: 110 },
    { courseCode: "Aug", attendance: 85 },
    { courseCode: "Sep", attendance: 160 },
    { courseCode: "Oct", attendance: 140 },
    { courseCode: "Nov", attendance: 120 },
    { courseCode: "Dec", attendance: 100 },
];

const CourseInfoPanel = ({ course, lecturers }: CourseInfoPanelProps) => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    return (
        <Box>
            {/* Info Cards + Attendance Chart */}
            <Flex gap="5" mb="8" direction={{ base: "column", lg: "row" }}>
                {/* Left: Info Cards */}
                <Flex gap="4" flex="1" wrap="wrap">
                    <Box
                        bg="gray.50"
                        borderRadius="lg"
                        px="5"
                        py="4"
                        flex="1"
                        minW="150px"
                    >
                        <Text fontSize="xs" color="gray.500" mb="1">Course Title</Text>
                        <Text fontSize="sm" fontWeight="600" color="gray.800">
                            {course.title}
                        </Text>
                    </Box>
                    <Box
                        bg="gray.50"
                        borderRadius="lg"
                        px="5"
                        py="4"
                        flex="1"
                        minW="120px"
                    >
                        <Text fontSize="xs" color="gray.500" mb="1">Course Code</Text>
                        <Text fontSize="sm" fontWeight="600" color="gray.800">
                            {course.code}
                        </Text>
                    </Box>
                    <Box
                        bg="gray.50"
                        borderRadius="lg"
                        px="5"
                        py="4"
                        flex="1"
                        minW="100px"
                    >
                        <Text fontSize="xs" color="gray.500" mb="1">Credit Unit</Text>
                        <Text fontSize="sm" fontWeight="600" color="gray.800">
                            {course.creditUnit}
                        </Text>
                    </Box>
                </Flex>

                {/* Right: Attendance Chart */}
                <Box flex="1.2" minW="300px">
                    <AttendanceChart
                        data={MOCK_ATTENDANCE}
                        fromDate={fromDate}
                        toDate={toDate}
                        onFromDateChange={setFromDate}
                        onToDateChange={setToDate}
                        onClear={() => { setFromDate(""); setToDate(""); }}
                    />
                </Box>
            </Flex>

            {/* Lecturers Section */}
            <Box>
                <Text fontSize="md" fontWeight="600" color="gray.800" mb="4">
                    Lecturers
                </Text>
                <Grid templateColumns="repeat(auto-fill, minmax(120px, 1fr))" gap="4">
                    {lecturers.map((lec) => (
                        <Box
                            key={lec.id}
                            bg="white"
                            border="1px solid"
                            borderColor="gray.100"
                            borderRadius="lg"
                            p="4"
                            textAlign="center"
                        >
                            <Flex
                                justify="center"
                                align="center"
                                w="12"
                                h="12"
                                mx="auto"
                                mb="2"
                                bg="gray.100"
                                borderRadius="full"
                            >
                                <User size={20} color="#718096" />
                            </Flex>
                            <Text fontSize="xs" fontWeight="600" color="gray.800" mb="2">
                                {lec.name}
                            </Text>
                            <Flex
                                justify="center"
                                align="center"
                                bg="accent.500"
                                color="white"
                                fontSize="10px"
                                fontWeight="500"
                                borderRadius="full"
                                px="3"
                                py="1"
                                cursor="pointer"
                                _hover={{ bg: "accent.600" }}
                                transition="background 0.15s"
                            >
                                See Info →
                            </Flex>
                        </Box>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default CourseInfoPanel;
