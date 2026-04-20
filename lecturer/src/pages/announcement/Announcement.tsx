
import { useState } from "react";
import { Box, Flex, Text, Heading } from "@chakra-ui/react";
import { X } from "lucide-react";
import { AnnouncementHook } from "@hooks/announcement.hook";
import AnnouncementList from "@components/shared/AnnouncementList";

const Announcement = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  
  const { 
    data: announcements = [], 
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
    <Box p="8" maxW="1400px" mx="auto">
      {/* Header */}
      <Flex align="center" justify="space-between" mb="8" flexWrap="wrap" gap="4">
        <Heading size="lg" fontWeight="700" color="#1e293b">
          Announcement
        </Heading>

        {/* Date Range Filter */}
        <Flex align="center" gap="3" flexWrap="wrap">
          <Text fontSize="xs" fontWeight="500" color="gray.500">From</Text>
          <Box
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            px="3"
            py="1.5"
            bg="white"
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
                color: "#334155",
              }}
            />
          </Box>
          
          <Text fontSize="xs" fontWeight="500" color="gray.500">To</Text>
          <Box
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            px="3"
            py="1.5"
            bg="white"
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
                color: "#334155",
              }}
            />
          </Box>
          
          {(fromDate || toDate) && (
            <Box
              cursor="pointer"
              onClick={clearDates}
              _hover={{ opacity: 0.7 }}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              p="1.5"
              display="flex"
              alignItems="center"
              bg="white"
            >
              <X size={16} color="#A0AEC0" />
            </Box>
          )}
        </Flex>
      </Flex>

      {/* Announcement List */}
      <AnnouncementList
        announcements={announcements}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
      />
    </Box>
  );
};

export default Announcement;