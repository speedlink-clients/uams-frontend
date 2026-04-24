import { useState } from "react";
import { Box, Flex, Text, Heading, Spinner, Center, Button } from "@chakra-ui/react";
import useUserStore from "@stores/user.store";
import { DashboardHook } from "@hooks/dashboard.hook";
import { TimetableHook } from "@hooks/timetable.hooks"; 
import StatCard from "@components/shared/StatCard";
import TimetablePanel from "@components/shared/TimetablePanel";
import { useNavigate } from "react-router";

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useUserStore();

    // Timetable filter state: today, tomorrow, week
    const [timetableFilter, setTimetableFilter] = useState("today");

    // Dashboard summary data (courses, projects, students)
    const { data: dashboardData, isLoading: isDashboardLoading, error: dashboardError } = DashboardHook.useDashboardData();

    // Fetch full timetable data for the lecturer
    const { data: timetableData = [], isLoading: isTimetableLoading } = TimetableHook.useTimetable();

    const isLoading = isDashboardLoading || isTimetableLoading;
    const error = dashboardError; // you can also handle timetable error separately

    // Extract first name for greeting
    const firstName = user?.firstName || "User";

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
            {/* Main Content (Left) */}
            <Box flex="1" minW="0">
                {/* Greeting */}
                <Box mb="6">
                    <Heading size="xl" fontWeight="700" color="#686A6F" fontSize="24px">
                        Hello <Text as="span" color="#0D141C" fontWeight="700">{firstName},</Text>
                    </Heading>
                    <Text color="#686A6F" fontSize="15px">
                        Welcome back
                    </Text>
                </Box>

                {/* Stat Cards */}
                <Flex gap="5" mb="8">
                    <StatCard
                        label="Assigned courses"
                        value={summary?.totalCourses ?? 0}
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

                {/* Timetable Box with Heading and Button */}
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
                    
                    {/* Mini timetable preview */}
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