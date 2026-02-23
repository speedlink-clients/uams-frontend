import { useState } from "react";
import { Box, Flex, Text, Heading, Icon } from "@chakra-ui/react";
import { Download, Upload, SlidersHorizontal } from "lucide-react";
import { useParams } from "react-router";
import { ResultHook } from "@hooks/result.hook";
import ResultsTable from "@components/shared/ResultsTable";

const ResultDetail = () => {
    const { courseId } = useParams();
    const [activeTab, setActiveTab] = useState<"lecturer" | "ero">("lecturer");

    const { data: results, isLoading } = ResultHook.useResults(courseId!, activeTab);

    // Use a mock course title (in production, fetch from API)
    const courseTitle = "Computer Science Introduction";

    return (
        <Box>
            {/* Header + Action Buttons */}
            <Flex align="center" justify="space-between" mb="5">
                <Heading size="lg" fontWeight="600" color="gray.800">
                    {courseTitle}
                </Heading>

                {activeTab === "lecturer" && (
                    <Flex gap="3">
                        <Flex
                            align="center"
                            gap="2"
                            px="4"
                            py="2"
                            border="1px solid"
                            borderColor="accent.500"
                            borderRadius="md"
                            color="accent.500"
                            cursor="pointer"
                            _hover={{ bg: "accent.50" }}
                            transition="background 0.15s"
                        >
                            <Icon as={Download} boxSize="4" />
                            <Text fontSize="xs" fontWeight="500">Download Sample File</Text>
                        </Flex>
                        <Flex
                            align="center"
                            gap="2"
                            px="4"
                            py="2"
                            bg="accent.500"
                            borderRadius="md"
                            color="white"
                            cursor="pointer"
                            _hover={{ bg: "accent.600" }}
                            transition="background 0.15s"
                        >
                            <Icon as={Upload} boxSize="4" />
                            <Text fontSize="xs" fontWeight="500">Upload Student result</Text>
                        </Flex>
                    </Flex>
                )}
            </Flex>

            {/* Tab Switcher + Filter */}
            <Flex align="center" justify="space-between" mb="5">
                <Flex
                    bg="gray.50"
                    borderRadius="md"
                    p="1"
                    gap="0"
                >
                    <Box
                        px="5"
                        py="2"
                        fontSize="sm"
                        fontWeight={activeTab === "lecturer" ? "600" : "400"}
                        color={activeTab === "lecturer" ? "accent.500" : "gray.500"}
                        bg={activeTab === "lecturer" ? "white" : "transparent"}
                        borderRadius="md"
                        cursor="pointer"
                        onClick={() => setActiveTab("lecturer")}
                        transition="all 0.15s"
                        boxShadow={activeTab === "lecturer" ? "sm" : "none"}
                    >
                        Lecturer Results
                    </Box>
                    <Box
                        px="5"
                        py="2"
                        fontSize="sm"
                        fontWeight={activeTab === "ero" ? "600" : "400"}
                        color={activeTab === "ero" ? "accent.500" : "gray.500"}
                        bg={activeTab === "ero" ? "white" : "transparent"}
                        borderRadius="md"
                        cursor="pointer"
                        onClick={() => setActiveTab("ero")}
                        transition="all 0.15s"
                        boxShadow={activeTab === "ero" ? "sm" : "none"}
                    >
                        ERO Results
                    </Box>
                </Flex>

                <Flex
                    align="center"
                    gap="2"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    px="4"
                    py="2"
                    cursor="pointer"
                    _hover={{ bg: "gray.50" }}
                    transition="background 0.15s"
                >
                    <Icon as={SlidersHorizontal} boxSize="3.5" color="gray.600" />
                    <Text fontSize="xs" fontWeight="500" color="gray.700">Filter</Text>
                </Flex>
            </Flex>

            {/* Results Table */}
            <ResultsTable results={results ?? []} isLoading={isLoading} />
        </Box>
    );
};

export default ResultDetail;
