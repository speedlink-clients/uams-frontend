import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import { Clock } from "lucide-react";
import type { TimetableItem } from "@type/timetable.type";

interface TimetablePanelProps {
    timetable: TimetableItem[];          // raw timetable data from API
    selectedFilter: string;              // "today" | "tomorrow" | "week"
    onFilterChange: (value: string) => void;
}

// Helper to get the current day name (lowercase)
const getCurrentDay = (): string => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return days[new Date().getDay()];
};

// Helper to get the next day name
const getNextDay = (): string => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const tomorrowIndex = (new Date().getDay() + 1) % 7;
    return days[tomorrowIndex];
};

// Get all days of the week starting from current day
const getRemainingWeekDays = (): string[] => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const todayIndex = new Date().getDay();
    return [...days.slice(todayIndex), ...days.slice(0, todayIndex)];
};

// Flatten schedule into an array of entries with day info
const flattenSchedule = (timetable: TimetableItem[]): Array<{
    id: string;
    title: string;
    courseCode: string;
    startTime: string;
    endTime: string;
    day: string;
}> => {
    const entries: Array<any> = [];

    timetable.forEach(item => {
        const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        days.forEach(day => {
            const slots = item.schedule[day as keyof typeof item.schedule];
            if (slots && slots.length) {
                slots.forEach(slot => {
                    entries.push({
                        id: `${item.id}-${day}-${slot.startTime}`,
                        title: item.title,
                        courseCode: slot.courseCode,
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        day: day,
                    });
                });
            }
        });
    });

    return entries;
};

const TimetablePanel = ({ timetable, selectedFilter, onFilterChange }: TimetablePanelProps) => {
    // Compute entries based on filter
    const entries = (() => {
        if (!timetable.length) return [];

        const allEntries = flattenSchedule(timetable);
        const currentDay = getCurrentDay();
        const nextDay = getNextDay();
        const weekDays = getRemainingWeekDays();

        switch (selectedFilter) {
            case "today":
                return allEntries.filter(entry => entry.day === currentDay);
            case "tomorrow":
                return allEntries.filter(entry => entry.day === nextDay);
            case "week":
                return allEntries.filter(entry => weekDays.includes(entry.day));
            default:
                return allEntries;
        }
    })();

    // Optional: you can sort entries by startTime
    entries.sort((a, b) => a.startTime.localeCompare(b.startTime));

    return (
        <Box
            bg="white"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.100"
            h="100%"
            display="flex"
            flexDirection="column"
            boxShadow="sm"
        >
            {/* Header */}
            <Flex align="center" justify="space-between" px="5" py="4.5" borderBottom="1px solid" borderColor="gray.50">
                <Text fontSize="md" fontWeight="600" color="gray.800">
                    Timetable
                </Text>

                <select
                    value={selectedFilter}
                    onChange={(e) => onFilterChange(e.target.value)}
                    style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#718096",
                        backgroundColor: "#F7FAFC",
                        border: "1px solid #EDF2F7",
                        borderRadius: "8px",
                        padding: "4px 10px",
                        cursor: "pointer",
                        outline: "none",
                    }}
                >
                    <option value="today">Today</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="week">This Week</option>
                </select>
            </Flex>

            {/* Entries List */}
            <Box flex="1" overflowY="auto" px="5" py="5">
                {entries.length > 0 ? (
                    <Flex direction="column" gap="3">
                        {entries.map((entry) => {
                            // Determine if the class is currently happening (simple comparison with current time)
                            const now = new Date();
                            const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
                            const isActive = selectedFilter === "today" && entry.startTime <= currentTime && entry.endTime >= currentTime;

                            return (
                                <Box
                                    key={entry.id}
                                    bg={isActive ? "accent.500" : "gray.50"}
                                    color={isActive ? "white" : "gray.800"}
                                    borderRadius="lg"
                                    px="4.5"
                                    py="4"
                                    borderLeft="4px solid"
                                    borderLeftColor={isActive ? "accent.600" : "gray.200"}
                                    transition="all 0.15s ease"
                                    position="relative"
                                    overflow="hidden"
                                >
                                    <Text
                                        fontSize="14px"
                                        fontWeight="600"
                                        mb="1.5"
                                        lineHeight="shorter"
                                    >
                                        {entry.title}
                                    </Text>
                                    <Flex align="center" gap="3.5">
                                        <Text
                                            fontSize="11px"
                                            opacity={isActive ? 0.9 : 0.6}
                                            fontWeight="500"
                                        >
                                            {entry.courseCode}
                                        </Text>
                                        <Flex align="center" gap="1.5">
                                            <Icon
                                                as={Clock}
                                                boxSize="3"
                                                opacity={isActive ? 0.9 : 0.5}
                                            />
                                            <Text
                                                fontSize="11px"
                                                opacity={isActive ? 0.9 : 0.6}
                                                fontWeight="500"
                                            >
                                                {entry.startTime} - {entry.endTime}
                                            </Text>
                                        </Flex>
                                    </Flex>
                                </Box>
                            );
                        })}
                    </Flex>
                ) : (
                    <Flex h="full" direction="column" align="center" justify="center" textAlign="center" py="10" opacity={0.6}>
                        <Icon as={Clock} boxSize="8" color="gray.200" mb="3" />
                        <Text fontSize="13px" fontWeight="500" color="gray.500">
                            No classes scheduled for {selectedFilter === "today" ? "today" : selectedFilter === "tomorrow" ? "tomorrow" : "the week"}
                        </Text>
                    </Flex>
                )}
            </Box>
        </Box>
    );
};

export default TimetablePanel;