import { Box, Text, Flex } from "@chakra-ui/react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import type { Course } from "@type/course.type";

interface CourseListProps {
    courses: Course[];
    isLoading?: boolean;
}

const CourseList = ({ courses, isLoading }: CourseListProps) => {
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <Flex justify="center" py="12">
                <Text color="gray.500" fontSize="sm">Loading courses...</Text>
            </Flex>
        );
    }

    if (courses.length === 0) {
        return (
            <Flex justify="center" py="12">
                <Text color="gray.500" fontSize="sm">No courses found.</Text>
            </Flex>
        );
    }

    return (
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
            {courses.map((course, index) => (
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
                    onClick={() => navigate(`/courses/${course.id}`, { state: { course } })}
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
    );
};

export default CourseList;
