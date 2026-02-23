import { useState, useMemo } from "react";
import { Box, Flex, Text, Heading } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { CourseHook } from "@hooks/course.hook";
import CourseInfoPanel from "@components/shared/CourseInfoPanel";
import CourseStudentsTable from "@components/shared/CourseStudentsTable";

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"info" | "students">("info");
    const [studentSearch, setStudentSearch] = useState("");

    const { data: courseData } = CourseHook.useCourse(courseId!);
    const { data: students, isLoading: studentsLoading } = CourseHook.useCourseStudents(
        courseId!,
        studentSearch
    );

    const course = courseData?.course;
    const lecturers = courseData?.lecturers ?? [];

    // Client-side student search
    const filteredStudents = useMemo(() => {
        if (!students) return [];
        if (!studentSearch.trim()) return students;
        const q = studentSearch.toLowerCase();
        return students.filter(
            (s) =>
                s.surname.toLowerCase().includes(q) ||
                s.otherNames.toLowerCase().includes(q) ||
                s.email.toLowerCase().includes(q)
        );
    }, [students, studentSearch]);

    if (!course) {
        return (
            <Flex justify="center" py="12">
                <Text color="gray.500">Loading course...</Text>
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
                onClick={() => navigate("/courses")}
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

            {/* Title & Description */}
            <Heading size="lg" fontWeight="600" color="gray.800" mb="3">
                {course.title} ({course.code})
            </Heading>
            <Text fontSize="sm" color="gray.600" mb="6" maxW="700px" lineHeight="tall">
                {course.description}
            </Text>

            {/* Tab Switcher */}
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

            {/* Tab Content */}
            {activeTab === "info" ? (
                <CourseInfoPanel course={course} lecturers={lecturers} />
            ) : (
                <CourseStudentsTable
                    students={filteredStudents}
                    isLoading={studentsLoading}
                    search={studentSearch}
                    onSearchChange={setStudentSearch}
                />
            )}
        </Box>
    );
};

export default CourseDetail;
