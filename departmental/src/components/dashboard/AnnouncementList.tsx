import { Box, Flex, Text, Button, Link } from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import type { Announcement } from "@type/common.type";

interface Props {
    announcements: Announcement[];
}

export const AnnouncementList = ({ announcements }: Props) => {
    const navigate = useNavigate();

    return (
        <Box bg="white" borderRadius="2xl" p="6" boxShadow="sm" border="1px solid" borderColor="gray.100" display="flex" flexDirection="column" h="full">
            <Flex alignItems="center" justifyContent="space-between" mb="6">
                <Text fontWeight="bold" color="fg">Announcements</Text>
                <Button
                    bg="accent"
                    color="white"
                    px="3"
                    py="1.5"
                    borderRadius="round"
                    fontSize="xs"
                    fontWeight="semibold"
                    cursor="pointer"
                    onClick={() => navigate("/announcements")}
                    size="xs"
                >
                <Plus /> Create New
                </Button>
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
                                <Text fontSize="sm" fontWeight="semibold" color="slate.600" _hover={{ color: "blue.600" }} transition="all 0.2s">
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