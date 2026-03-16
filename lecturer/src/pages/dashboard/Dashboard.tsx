import { useState, useMemo } from "react";
import { Box, Flex, Text, Heading, Spinner, Center, Button } from "@chakra-ui/react";
import useUserStore from "@stores/user.store";
import { DashboardHook } from "@hooks/dashboard.hook";
import StatCard from "@components/shared/StatCard";
import AttendanceChart from "@components/shared/AttendanceChart";
import TimetablePanel from "@components/shared/TimetablePanel";
import { useNavigate } from "react-router";

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useUserStore();

    // Date filter state for attendance chart
    const today = new Date().toISOString().split("T")[0];
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);

    // Timetable filter state: today, tomorrow, week
    const [timetableFilter, setTimetableFilter] = useState("today");

    // Data from hooks
    const { data: dashboardData, isLoading, error } = DashboardHook.useDashboardData();
    const { data: attendanceData } = DashboardHook.useAttendance(fromDate, toDate);

    const handleClearDateFilter = () => {
        setFromDate(today);
        setToDate(today);
    };

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
                            colorScheme="blue"
                            size="sm"
                            onClick={() => navigate("/timetable")}
                        >
                            View Full Timetable
                        </Button>
                    </Flex>
                    
                    {/* Mini timetable preview */}
                    <Box maxH="300px" overflowY="auto">
                        <TimetablePanel
                            entries={normalizedEntries as any}
                            selectedFilter={timetableFilter}
                            onFilterChange={setTimetableFilter}
                        />
                    </Box>
                </Box>

                {/* Attendance Chart 
                <AttendanceChart
                    data={attendanceData ?? []}
                    fromDate={fromDate}
                    toDate={toDate}
                    onFromDateChange={setFromDate}
                    onToDateChange={setToDate}
                    onClear={handleClearDateFilter}
                /> */}
            </Box>

    
        </Flex>
    );
};

export default Dashboard;