import { useState } from "react";
import { Box, Flex, Text, Heading, Icon } from "@chakra-ui/react";
import { Plus, X } from "lucide-react";
import { AnnouncementHook } from "@hooks/announcement.hook";
import AnnouncementList from "@components/shared/AnnouncementList";
import CreateAnnouncementModal from "@components/shared/CreateAnnouncementModal";

const Announcement = () => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: announcements, isLoading } = AnnouncementHook.useAnnouncements(
        fromDate || undefined,
        toDate || undefined
    );
    const createMutation = AnnouncementHook.useCreateAnnouncement();

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

                {/* Create New Announcement Button - Commented out
                <Flex
                    align="center"
                    gap="2"
                    px="5"
                    py="2.5"
                    bg="accent.500"
                    borderRadius="md"
                    color="white"
                    cursor="pointer"
                    _hover={{ bg: "accent.600" }}
                    transition="background 0.15s"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Icon as={Plus} boxSize="4" />
                    <Text fontSize="sm" fontWeight="500">Create New Announcement</Text>
                </Flex>
                */}
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
            />

            {/* Create Modal - Commented out since button is commented
            <CreateAnnouncementModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={(payload) => createMutation.mutate(payload)}
            />
            */}
        </Box>
    );
};

export default Announcement;