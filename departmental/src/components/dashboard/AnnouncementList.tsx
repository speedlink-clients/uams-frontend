import { Box, Flex, Text } from "@chakra-ui/react";
import { Plus } from "lucide-react";
import type { Announcement } from "@type/common.type";

interface Props {
    announcements: Announcement[];
}

export const AnnouncementList = ({ announcements }: Props) => {
    return (
        <Box bg="white" borderRadius="2xl" p="6" boxShadow="sm" border="1px solid" borderColor="gray.100" display="flex" flexDirection="column" h="full">
            <Flex alignItems="center" justifyContent="space-between" mb="6">
                <Text fontWeight="bold" color="slate.800">Announcements</Text>
                <Flex
                    as="button"
                    bg="blue.600"
                    color="white"
                    px="3"
                    py="1.5"
                    borderRadius="lg"
                    fontSize="xs"
                    fontWeight="semibold"
                    _hover={{ bg: "blue.700" }}
                    transition="all 0.2s"
                    alignItems="center"
                    gap="1.5"
                    border="none"
                    cursor="pointer"
                >
                    <Plus size={14} />
                    Create New
                </Flex>
            </Flex>

            <Flex direction="column" gap="4" overflowY="auto" maxH="350px" pr="2">
                {announcements.length === 0 ? (
                    <Flex direction="column" alignItems="center" justifyContent="center" py="12" textAlign="center">
                        <Text fontSize="sm" fontWeight="medium" color="slate.400">No New Announcements</Text>
                    </Flex>
                ) : (
                    announcements.map((item) => (
                        <Box key={item.id} borderBottom="1px solid" borderColor="gray.50" pb="4" _last={{ borderBottom: "none", pb: "0" }}>
                            <Flex justifyContent="space-between" alignItems="flex-start" mb="1">
                                <Text fontSize="sm" fontWeight="semibold" color="slate.800" _hover={{ color: "blue.600" }} transition="all 0.2s">
                                    {item.title}
                                </Text>
                                <Text fontSize="10px" fontWeight="medium" color="slate.400" bg="slate.50" px="1.5" py="0.5" borderRadius="sm" textTransform="uppercase" letterSpacing="tighter">
                                    {item.date}
                                </Text>
                            </Flex>
                            <Text fontSize="xs" color="slate.500" lineHeight="relaxed" lineClamp={2}>
                                {item.description}
                            </Text>
                        </Box>
                    ))
                )}
            </Flex>
        </Box>
    );
};
