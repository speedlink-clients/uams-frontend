import { useState } from "react";
import { Box, Flex, Text, Heading, Spinner, Center, Button } from "@chakra-ui/react";
import useUserStore from "@stores/user.store";
import { DashboardHook } from "@hooks/dashboard.hook";
import { TimetableHook } from "@hooks/timetable.hooks";
import { CourseHook } from "@hooks/course.hook"; 
import StatCard from "@components/shared/StatCard";
import TimetablePanel from "@components/shared/TimetablePanel";
import { useNavigate } from "react-router";

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useUserStore();

    const [timetableFilter, setTimetableFilter] = useState("today");

    const { data: dashboardData, isLoading: isDashboardLoading, error: dashboardError } = DashboardHook.useDashboardData();
    const { data: timetableData = [], isLoading: isTimetableLoading } = TimetableHook.useTimetable();
    const { data: assignedCourses = [], isLoading: isAssignedLoading } = CourseHook.useAssignedCourses();

    const isLoading = isDashboardLoading || isTimetableLoading || isAssignedLoading;
    const error = dashboardError;

    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    const fullName = lastName ? `${firstName} ${lastName}` : firstName;
    const displayName = fullName || "User";

    if (isLoading) {
        return (
            <Center h="100%">
                <Spinner size="xl" color="accent.500" borderWidth="4px" />
            </Center>
        );
    }

    if (error) {
        return (
            <Center h="100%">
                <Text color="red.500">Failed to load dashboard data. Please try again later.</Text>
            </Center>
        );
    }

    const summary = dashboardData?.summary;

    return (
        <Flex gap="10" h="100%">
            <Box flex="1" minW="0">
                <Box mb="6">
                    <Heading size="xl" fontWeight="700" color="#686A6F" fontSize="24px">
                        Hello <Text as="span" color="#0D141C" fontWeight="700">{displayName},</Text>
                    </Heading>
                    <Text color="#686A6F" fontSize="15px">
                        Welcome back
                    </Text>
                </Box>

                <Flex gap="5" mb="8">
                    <StatCard
                        label="Assigned courses"
                        value={assignedCourses.length}
                        colorScheme="pink"
                    />
                    <StatCard
                        label="Ongoing projects"
                        value={summary?.totalProjects ?? 0}
                        colorScheme="green"
                    />
                    <StatCard
                        label="Total Students"
                        value={summary?.totalStudents ?? 0}
                        colorScheme="green"
                    />
                </Flex>

                <Box 
                    mb="6" 
                    p="5" 
                    bg="white" 
                    borderRadius="lg" 
                    border="1px solid" 
                    borderColor="gray.100"
                    boxShadow="sm"
                >
                    <Flex align="center" justify="space-between" mb="4">
                        <Heading size="md" fontWeight="600" color="gray.800">
                            Timetable
                        </Heading>
                        <Button
                            bg="#3b82f6"
                            variant="solid"
                            size="sm"
                            onClick={() => navigate("/timetable")}
                        >
                            View Full Timetable
                        </Button>
                    </Flex>
                    
                    <Box maxH="300px" overflowY="auto">
                        <TimetablePanel
                            timetable={timetableData}
                            selectedFilter={timetableFilter}
                            onFilterChange={setTimetableFilter}
                        />
                    </Box>
                </Box>
            </Box>
        </Flex>
    );
};

export default Dashboard;