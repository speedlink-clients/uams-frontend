import { useState } from "react";
import { Box, Flex, Text, Heading } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { CourseHook } from "@hooks/course.hook";
import StudentInfoPanel from "@components/shared/StudentInfoPanel";

const CourseStudentDetail = () => {
    const { courseId, studentId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"info" | "students">("info");

    const { data: student } = CourseHook.useCourseStudent(courseId!, studentId!);

    if (!student) {
        return (
            <Flex justify="center" py="12">
                <Text color="gray.500">Loading student...</Text>
            </Flex>
        );
    }

    return (
        <Box>
            {/* Back Button */}
            <Flex
                align="center"
                gap="2"
                mb="4"
                cursor="pointer"
                onClick={() => navigate(`/courses/${courseId}`)}
                w="fit-content"
                px="3"
                py="1.5"
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
                _hover={{ bg: "gray.50" }}
                transition="background 0.15s"
            >
                <ArrowLeft size={14} />
                <Text fontSize="xs" fontWeight="500">Back</Text>
            </Flex>

            {/* Tabs */}
            <Flex gap="0" mb="6">
                <Box
                    px="5"
                    py="2"
                    fontSize="sm"
                    fontWeight={activeTab === "info" ? "600" : "400"}
                    color={activeTab === "info" ? "gray.800" : "gray.500"}
                    borderBottom="2px solid"
                    borderBottomColor={activeTab === "info" ? "gray.800" : "transparent"}
                    cursor="pointer"
                    onClick={() => setActiveTab("info")}
                    transition="all 0.15s"
                >
                    Info
                </Box>
                <Box
                    px="5"
                    py="2"
                    fontSize="sm"
                    fontWeight={activeTab === "students" ? "600" : "400"}
                    color={activeTab === "students" ? "gray.800" : "gray.500"}
                    borderBottom="2px solid"
                    borderBottomColor={activeTab === "students" ? "gray.800" : "transparent"}
                    cursor="pointer"
                    onClick={() => setActiveTab("students")}
                    transition="all 0.15s"
                >
                    Students
                </Box>
            </Flex>

            {/* Student Header */}
            <Heading size="lg" fontWeight="600" color="gray.800" mb="0.5">
                {student.surname} {student.otherNames.split(" ")[0]}
            </Heading>
            <Text fontSize="sm" color="gray.500" mb="6">
                {student.matNo}
            </Text>

            {/* Student Info */}
            <StudentInfoPanel student={student} />
        </Box>
    );
};

export default CourseStudentDetail;
