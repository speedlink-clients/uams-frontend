import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import { Clock } from "lucide-react";
import type { TimetableEntry } from "@type/dashboard.type";

interface TimetablePanelProps {
    entries: TimetableEntry[];
    selectedFilter: string;
    onFilterChange: (value: string) => void;
}

const TimetablePanel = ({ entries, selectedFilter, onFilterChange }: TimetablePanelProps) => {
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
                <Flex direction="column" gap="3">
                    {entries.map((entry) => (
                        <Box
                            key={entry.id}
                            bg={entry.isActive ? "#1273D4" : "#F8FAFC"}
                            color={entry.isActive ? "white" : "gray.800"}
                            borderRadius="lg"
                            px="4.5"
                            py="4"
                            borderLeft="4px solid"
                            borderLeftColor={entry.isActive ? "#0D5BA8" : "#E2E8F0"}
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
                                    opacity={entry.isActive ? 0.9 : 0.6}
                                    fontWeight="500"
                                >
                                    {entry.courseCode}
                                </Text>
                                <Flex align="center" gap="1.5">
                                    <Icon
                                        as={Clock}
                                        boxSize="3"
                                        opacity={entry.isActive ? 0.9 : 0.5}
                                    />
                                    <Text
                                        fontSize="11px"
                                        opacity={entry.isActive ? 0.9 : 0.6}
                                        fontWeight="500"
                                    >
                                        {entry.startTime} - {entry.endTime}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Box>
                    ))}
                </Flex>
            </Box>
        </Box>
    );
};

export default TimetablePanel;
