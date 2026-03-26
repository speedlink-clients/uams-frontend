import { Box, Flex, Text, Spinner } from "@chakra-ui/react";
import type { Announcement } from "@type/announcement.type";

interface AnnouncementListProps {
  announcements: Announcement[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const AnnouncementList = ({ 
  announcements, 
  isLoading, 
  error, 
  onRetry 
}: AnnouncementListProps) => {
  if (isLoading) {
    return (
      <Flex justify="center" py="12" direction="column" align="center" gap="3">
        <Spinner size="md" color="blue.500" />
        <Text color="gray.500" fontSize="sm">Loading announcements...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" py="12" direction="column" align="center" gap="4">
        <Text color="red.500" fontSize="sm">
          Error loading announcements: {error.message}
        </Text>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              background: '#3182ce',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        )}
      </Flex>
    );
  }

  if (announcements.length === 0) {
    return (
      <Flex justify="center" py="12">
        <Text color="gray.500" fontSize="sm">No announcements found.</Text>
      </Flex>
    );
  }

  return (
    <Box>
      {announcements.map((item) => (
        <Flex
          key={item.id}
          justify="space-between"
          align="flex-start"
          py="5"
          borderBottom="1px solid"
          borderColor="gray.100"
          _last={{ borderBottom: "none" }}
          _hover={{ bg: "gray.50" }}
          transition="background 0.15s"
          px="4"
          borderRadius="md"
        >
          <Box maxW="500px">
            <Text fontSize="sm" fontWeight="600" color="gray.800" mb="1">
              {item.title}
            </Text>
            <Text
              fontSize="xs"
              color="gray.500"
              lineHeight="tall"
              overflow="hidden"
              display="-webkit-box"
              style={{ WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
            >
              {item.description}
            </Text>
          </Box>
          <Text fontSize="xs" color="gray.500" whiteSpace="nowrap" ml="8">
            {formatDate(item.date)}
          </Text>
        </Flex>
      ))}
    </Box>
  );
};

export default AnnouncementList;