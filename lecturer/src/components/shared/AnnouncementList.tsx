import { Box, Flex, Text } from "@chakra-ui/react";
import type { Announcement } from "@type/announcement.type";

interface AnnouncementListProps {
    announcements: Announcement[];
    isLoading?: boolean;
}

const AnnouncementList = ({ announcements, isLoading }: AnnouncementListProps) => {
    if (isLoading) {
        return (
            <Flex justify="center" py="12">
                <Text color="gray.500" fontSize="sm">Loading announcements...</Text>
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
                        {item.date}
                    </Text>
                </Flex>
            ))}
        </Box>
    );
};

export default AnnouncementList;
