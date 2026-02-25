import { useState, useMemo } from "react";
import { Box, Flex, Text, Heading, Spinner, Center } from "@chakra-ui/react";
import useUserStore from "@stores/user.store";
import { DashboardHook } from "@hooks/dashboard.hook";
import StatCard from "@components/shared/StatCard";
import TimetablePanel from "@components/shared/TimetablePanel";

const Dashboard = () => {
    const { user } = useUserStore();

    // Timetable filter state: today, tomorrow, week
    const [timetableFilter, setTimetableFilter] = useState("today");

    // Data from hook
    const { data: dashboardData, isLoading, error } = DashboardHook.useDashboardData();

    const currentDay = useMemo(() => {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[new Date().getDay()];
    }, []);

    const tomorrowDay = useMemo(() => {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return days[tomorrow.getDay()];
    }, []);

    // Filtered timetable entries
    const timetableEntries = useMemo(() => {
        if (!dashboardData?.timetable?.byDay) return [];

        if (timetableFilter === "today") {
            return dashboardData.timetable.byDay[currentDay] || [];
        }
        if (timetableFilter === "tomorrow") {
            return dashboardData.timetable.byDay[tomorrowDay] || [];
        }
        if (timetableFilter === "week") {
            // Flatten all days
            return Object.values(dashboardData.timetable.byDay).flat();
        }
        return [];
    }, [dashboardData, timetableFilter, currentDay, tomorrowDay]);

    // Map TimetableSlot to what TimetablePanel expects (it expects .title, we have .courseTitle)
    const normalizedEntries = useMemo(() => {
        return timetableEntries.map(slot => ({
            ...slot,
            title: slot.courseTitle || "No Title",
            isActive: timetableFilter === "today" // Simple heuristic for active
        }));
    }, [timetableEntries, timetableFilter]);

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
                        colorScheme="green" // Using green as blue is not allowed
                    />
                </Flex>

                {/* Placeholder for other content or empty space since Attendance was removed */}
                <Box mt="10">
                    <Text fontSize="sm" color="gray.500" fontStyle="italic">
                        * Summary data reflects your current academic workload and interactions.
                    </Text>
                </Box>
            </Box>

            {/* Timetable Panel (Right) — fills available height, scrolls internally */}
            <Box w="320px" flexShrink={0} h="100%" maxH="calc(100vh - 120px)">
                <TimetablePanel
                    entries={normalizedEntries as any}
                    selectedFilter={timetableFilter}
                    onFilterChange={setTimetableFilter}
                />
            </Box>
        </Flex>
    );
};

export default Dashboard;
