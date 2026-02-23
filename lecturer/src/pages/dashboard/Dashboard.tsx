import { useState } from "react";
import { Box, Flex, Text, Heading } from "@chakra-ui/react";
import useUserStore from "@stores/user.store";
import { DashboardHook } from "@hooks/dashboard.hook";
import StatCard from "@components/shared/StatCard";
import AttendanceChart from "@components/shared/AttendanceChart";
import TimetablePanel from "@components/shared/TimetablePanel";

const Dashboard = () => {
    const { name } = useUserStore();

    // Date filter state for attendance chart
    const today = new Date().toISOString().split("T")[0];
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);

    // Timetable filter state
    const [timetableFilter, setTimetableFilter] = useState("today");

    // Data from hooks
    const { data: stats } = DashboardHook.useStats();
    const { data: attendance } = DashboardHook.useAttendance(fromDate, toDate);
    const { data: timetable } = DashboardHook.useTimetable(timetableFilter);

    const handleClearDateFilter = () => {
        setFromDate(today);
        setToDate(today);
    };

    // Extract first name for greeting
    const firstName = name ? name.split(" ")[0] : "User";

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
                        value={stats?.assignedCourses ?? 0}
                        colorScheme="pink"
                    />
                    <StatCard
                        label="Ongoing projects"
                        value={stats?.ongoingProjects ?? 0}
                        colorScheme="green"
                    />
                </Flex>

                {/* Attendance Chart */}
                <AttendanceChart
                    data={attendance ?? []}
                    fromDate={fromDate}
                    toDate={toDate}
                    onFromDateChange={setFromDate}
                    onToDateChange={setToDate}
                    onClear={handleClearDateFilter}
                />
            </Box>

            {/* Timetable Panel (Right) — fills available height, scrolls internally */}
            <Box w="320px" flexShrink={0} h="100%" maxH="calc(100vh - 120px)">
                <TimetablePanel
                    entries={timetable ?? []}
                    selectedFilter={timetableFilter}
                    onFilterChange={setTimetableFilter}
                />
            </Box>
        </Flex>
    );
};

export default Dashboard;
