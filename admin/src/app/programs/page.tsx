import { useState } from "react";
import { Box, Flex, Text, Tabs } from "@chakra-ui/react";
import { BookOpen, Layers } from "lucide-react";
import { Routes, Route } from "react-router";
import CoursesTab from "@components/programs/CoursesTab";
import ProgramTypeTab from "@components/programs/ProgramTypeTab";

const ProgramCoursesPage = () => {
    const [activeTab, setActiveTab] = useState("courses");

    return (
        <Flex direction="column" gap="6">
            <Box>
                <Text fontSize="2xl" fontWeight="bold" color="slate.800" mb="2">
                    Programs & Courses
                </Text>
                
                <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value)} variant="plain">
                    <Flex justifyContent="flex-start" mb="8">
                        <Tabs.List bg="slate.50" p="1.5" borderRadius="lg" border="xs" borderColor="border.muted" display="flex" gap="2">
                            <Tabs.Trigger 
                                value="courses" 
                                color="slate.500" 
                                fontWeight="bold" 
                                borderRadius="md" 
                                px="4" 
                                py="2.5" 
                                gap="2"
                                _selected={{ bg: "white", color: "#1D7AD9", border: "1px solid", borderColor: "slate.200" }}
                                _hover={{ color: "slate.700", bg: "slate.100", _selected: { color: "#1D7AD9", bg: "white" } }}
                                transition="all 0.2s"
                                border="1px solid transparent"
                            >
                                <BookOpen size={16} /> Courses
                            </Tabs.Trigger>
                            
                            <Tabs.Trigger 
                                value="program-types" 
                                color="slate.500" 
                                fontWeight="bold" 
                                borderRadius="md" 
                                px="4" 
                                py="2.5" 
                                gap="2"
                                _selected={{ bg: "white", color: "#1D7AD9", border: "1px solid", borderColor: "slate.200" }}
                                _hover={{ color: "slate.700", bg: "slate.100", _selected: { color: "#1D7AD9", bg: "white" } }}
                                transition="all 0.2s"
                                border="1px solid transparent"
                            >
                                <Layers size={16} /> Program Types
                            </Tabs.Trigger>
                        </Tabs.List>
                    </Flex>

                    <Tabs.Content value="courses" p={0}>
                        <Routes>
                            <Route index element={<CoursesTab />} />
                            <Route path="courses" element={<CoursesTab />} />
                            <Route path="courses/new" element={<CoursesTab isCreatingRoute />} />
                            <Route path="courses/edit/:id" element={<CoursesTab isEditingRoute />} />
                        </Routes>
                    </Tabs.Content>
                    <Tabs.Content value="program-types" p={0}>
                        <ProgramTypeTab />
                    </Tabs.Content>
                </Tabs.Root>
            </Box>
        </Flex>
    );
};

export default ProgramCoursesPage;
