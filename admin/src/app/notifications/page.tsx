import { Bell, CreditCard, UserPlus, Info, CheckCircle2, Check, MoreHorizontal } from "lucide-react";
import { Box, Flex, Text } from "@chakra-ui/react";

interface NotificationItem {
    id: string;
    title: string;
    description: string;
    time: string;
    type: "payment" | "user" | "system" | "success";
    isRead: boolean;
    bgType: "blue" | "white";
}

const NOTIFICATIONS: NotificationItem[] = [
    { id: "1", title: "New Fee Payment Received", description: "Student Aisha Bello (U2020/2502201) just paid N230,000 for 1st Semester School fees via Mastercard.", time: "2 mins ago", type: "payment", isRead: false, bgType: "blue" },
    { id: "2", title: "Scheduled System Maintenance", description: "The departmental portal will undergo scheduled maintenance this weekend from 10 PM to 4 AM.", time: "4 hours ago", type: "system", isRead: false, bgType: "white" },
    { id: "3", title: "New Staff Account Activated", description: "Dr. Sarah James from the Department of Computer Science has successfully activated her portal account.", time: "1 day ago", type: "user", isRead: true, bgType: "blue" },
    { id: "4", title: "New Announcements Posted", description: "Three new announcements have been added for the upcoming academic calendar and exam schedules.", time: "2 days ago", type: "success", isRead: true, bgType: "white" },
    { id: "5", title: "Revenue Milestone Reached", description: "The department has reached 80% of the projected revenue for the 2024/2025 academic session.", time: "3 days ago", type: "success", isRead: true, bgType: "blue" },
    { id: "6", title: "Course Registration Update", description: "Updated prerequisites for CSC 301. All eligible students have been notified via their portals.", time: "4 days ago", type: "system", isRead: true, bgType: "white" },
];

const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
        case "payment": return <CreditCard size={20} />;
        case "user": return <UserPlus size={20} />;
        case "system": return <Info size={20} />;
        case "success": return <CheckCircle2 size={20} />;
        default: return <Bell size={20} />;
    }
};

const getTypeColor = (type: NotificationItem["type"]) => {
    switch (type) {
        case "payment": return { color: "green.500", borderColor: "green.50" };
        case "user": return { color: "blue.500", borderColor: "blue.50" };
        case "system": return { color: "orange.500", borderColor: "orange.50" };
        case "success": return { color: "blue.500", borderColor: "blue.50" };
        default: return { color: "fg.subtle", borderColor: "slate.50" };
    }
};

const NotificationsPage = () => {
    return (
        <Box maxW="1400px" mx="auto">
            <Flex justifyContent="space-between" alignItems="center" mb="12">
                <Box>
                    <Text fontSize="3xl" fontWeight="bold" color="fg.muted">Notifications</Text>
                    <Text color="fg.muted" mt="1" fontSize="sm">Stay updated with the latest activities across the department.</Text>
                </Box>
                <Flex as="button" fontSize="xs" fontWeight="bold" color="blue.600" _hover={{ color: "blue.700" }} bg="blue.50" px="6" py="3" borderRadius="xl" border="xs" borderColor="blue.100" alignItems="center" gap="2" transition="all 0.2s" cursor="pointer">
                    <Check size={16} /> Mark all as read
                </Flex>
            </Flex>

            <Box borderRadius="2xl" overflow="hidden" boxShadow="sm" border="xs" borderColor="border.muted">
                {NOTIFICATIONS.map((n) => {
                    const styles = getTypeColor(n.type);
                    return (
                        <Flex key={n.id} px="10" py="8" transition="all 0.2s" position="relative" borderBottom="xs" borderColor="border.muted" _last={{ borderBottom: "none" }} bg={n.bgType === "blue" ? "#F4FAFF" : "white"} gap="6" role="group">
                            <Flex shrink={0} w="12" h="12" borderRadius="xl" alignItems="center" justifyContent="center" bg="white" color={styles.color} border="xs" borderColor={styles.borderColor} boxShadow="sm">
                                {getIcon(n.type)}
                            </Flex>
                            <Box flex="1">
                                <Flex justifyContent="space-between" alignItems="flex-start" mb="2">
                                    <Text fontSize="md" fontWeight="bold" color="fg.muted">{n.title}</Text>
                                    <Flex alignItems="center" gap="3">
                                        <Text fontSize="10px" fontWeight="bold" color="fg.subtle" textTransform="uppercase" letterSpacing="widest">{n.time}</Text>
                                        {!n.isRead && <Box w="2" h="2" bg="blue.600" borderRadius="full" boxShadow="0 0 4px rgba(37,99,235,0.5)" />}
                                    </Flex>
                                </Flex>
                                <Text fontSize="xs" color="fg.subtle" lineHeight="relaxed" maxW="3xl">{n.description}</Text>
                            </Box>
                            <Flex opacity="0" _groupHover={{ opacity: 1 }} transition="all 0.2s" alignItems="center">
                                <Box as="button" p="2" _hover={{ bg: "fg.subtle" }} borderRadius="lg" color="fg.subtle" cursor="pointer" border="none" bg="transparent">
                                    <MoreHorizontal size={20} />
                                </Box>
                            </Flex>
                        </Flex>
                    );
                })}
            </Box>

            <Box mt="8" textAlign="center">
                <Text as="button" fontSize="xs" fontWeight="bold" color="fg.subtle" _hover={{ color: "blue.600" }} textTransform="uppercase" letterSpacing="0.2em" transition="all 0.2s" cursor="pointer" bg="transparent" border="none">
                    View Notification History
                </Text>
            </Box>
        </Box>
    );
};

export default NotificationsPage;
