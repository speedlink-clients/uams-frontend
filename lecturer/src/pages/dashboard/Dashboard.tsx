import { useState } from "react";
import { Box, Flex, Text, Heading, Spinner, Center, Button, EmptyState, VStack } from "@chakra-ui/react";
import { TimetableHook } from "@hooks/timetable.hooks";
import { CourseHook } from "@hooks/course.hook"; 
import StatCard from "@components/shared/StatCard";
import TimetablePanel from "@components/shared/TimetablePanel";
import { useNavigate } from "react-router";
import useAuthStore from "@stores/auth.store";
import { LuCircleAlert } from "react-icons/lu";

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [timetableFilter, setTimetableFilter] = useState<"today" | "tomorrow" | "week">("today");

    const { data: timetableData = [], isLoading: isTimetableLoading, error: timetableError } = TimetableHook.useTimetable();
    const { data: allCourses = [], isLoading: isCoursesLoading, error: coursesError } = CourseHook.useAllCourses();   

    const fullName = user?.name || "";
    const displayName = fullName || "User";

    return (
        <Flex gap="10" h="100%">
            <Box flex="1" minW="0">
                <Box mb="6">
                    <Heading size="xl" fontWeight="700" color="fg.subtle" fontSize="24px">
                        Hello <Text as="span" color="fg.muted" fontWeight="700">{displayName},</Text>
                    </Heading>
                </Box>

                <Flex gap="5" mb="8">
                    {/* Stat card with its own loading/error state */}
                    {isCoursesLoading ? (
                        <StatCard label="Assigned courses" value={0} colorScheme="pink" />
                    ) : coursesError ? (
                        <StatCard label="Assigned courses" value={0}  colorScheme="pink" />
                    ) : (
                        <StatCard label="Assigned courses" value={allCourses.length} colorScheme="pink" />
                    )}
                    
                    <StatCard label="Ongoing projects" value={0} colorScheme="green" />
                    <StatCard label="Total Students" value={0} colorScheme="green" />
                </Flex>

                <Box 
                    mb="6" 
                    p="5" 
                    bg="white" 
                    borderRadius="lg" 
                    border="1px solid" 
                    borderColor="border.muted"
                >
                    <Flex align="center" justify="space-between" mb="4">
                        <Heading color="fg.muted">
                            Timetable
                        </Heading>
                        <Button
                            bg="accent.500"
                            variant="solid"
                            size="sm"
                            onClick={() => navigate("/timetable")}
                        >
                            View Full Timetable
                        </Button>
                    </Flex>
                    
                    <Box maxH="300px" overflowY="auto">
                        {isTimetableLoading ? (
                            <Center py={10}>
                                <Spinner size="lg" color="accent.500" />
                            </Center>
                        ) : timetableError ? (
                             <EmptyState.Root>
                              <EmptyState.Content>
                                <EmptyState.Indicator>
                                <LuCircleAlert />
                                </EmptyState.Indicator>
                                <VStack textAlign="center">
                               <EmptyState.Title>TimeTable not Available</EmptyState.Title>
                              <EmptyState.Description>
                                Checkback to your dashboard much later
                              </EmptyState.Description>
                             </VStack>
                           </EmptyState.Content>
                          </EmptyState.Root>
                        ) : (
                            <TimetablePanel
                               selectedFilter={timetableFilter}
                               onFilterChange={setTimetableFilter}
                            />
                        )}
                    </Box>
                </Box>
            </Box>
        </Flex>
    );
};

export default Dashboard;