import { useState } from "react";
import { Box, Flex, Text, Heading } from "@chakra-ui/react";
import { X } from "lucide-react";
import { AnnouncementHook } from "@hooks/announcement.hook";
import AnnouncementList from "@components/shared/AnnouncementList";

const Announcement = () => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const { 
        data: announcements, 
        isLoading, 
        error,
        refetch 
    } = AnnouncementHook.useAnnouncements(
        fromDate || undefined,
        toDate || undefined
    );

    const clearDates = () => {
        setFromDate("");
        setToDate("");
    };

    return (
        <Box>
            {/* Header */}
            <Flex align="center" justify="space-between" mb="5">
                <Heading size="lg" fontWeight="600" color="#000000" fontSize="24px">
                    Announcement
                </Heading>
            </Flex>

            {/* Date Range Filter */}
            <Flex align="center" justify="flex-end" gap="3" mb="4">
                <Text fontSize="xs" color="gray.500" fontWeight="500">From</Text>
                <Flex
                    align="center"
                    gap="1"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    px="3"
                    py="1.5"
                >
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        style={{
                            fontSize: "12px",
                            border: "none",
                            outline: "none",
                            background: "transparent",
                            cursor: "pointer",
                            color: "#4A5568",
                        }}
                    />
                </Flex>
                <Text fontSize="xs" color="gray.500" fontWeight="500">To</Text>
                <Flex
                    align="center"
                    gap="1"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    px="3"
                    py="1.5"
                >
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        style={{
                            fontSize: "12px",
                            border: "none",
                            outline: "none",
                            background: "transparent",
                            cursor: "pointer",
                            color: "#4A5568",
                        }}
                    />
                </Flex>
                {(fromDate || toDate) && (
                    <Box
                        cursor="pointer"
                        onClick={clearDates}
                        _hover={{ opacity: 0.7 }}
                    >
                        <X size={16} color="#A0AEC0" />
                    </Box>
                )}
            </Flex>

            {/* Announcement List */}
            <AnnouncementList
                announcements={announcements ?? []}
                isLoading={isLoading}
                error={error}
                onRetry={refetch}
            />
        </Box>
    );
};

export default Announcement;