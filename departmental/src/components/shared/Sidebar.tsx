import {
    LayoutDashboard,
    BookOpen,
    Users,
    UserSquare2,
    CreditCard,
    ShieldCheck,
    CalendarDays,
    Megaphone,
    Settings,
    User,
    LogOut,
} from "lucide-react";
import type { ViewType } from "@type/common.type";
import { Box, Flex, Text, Image } from "@chakra-ui/react";

interface SidebarProps {
    activeView: ViewType;
    onViewChange: (view: ViewType) => void;
    onLogout?: () => void;
}

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard' as ViewType },
    { icon: BookOpen, label: 'Programs & Courses' as ViewType },
    { icon: Users, label: 'Lecturers' as ViewType },
    { icon: UserSquare2, label: 'Students' as ViewType },
    { icon: CreditCard, label: 'Payments' as ViewType },
    { icon: ShieldCheck, label: 'ID Card Management' as ViewType },
    { icon: CalendarDays, label: 'Timetable' as ViewType },
    { icon: Megaphone, label: 'Announcements' as ViewType },
    { icon: Settings, label: 'Settings' as ViewType },
    { icon: User, label: 'Profile' as ViewType },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, onLogout }) => {
    return (
        <Box
            as="aside"
            w="64"
            bg="white"
            h="100vh"
            borderRight="1px solid"
            borderColor="gray.200"
            display="flex"
            flexDirection="column"
            position="fixed"
            left="0"
            top="0"
            zIndex="50"
        >
            <Flex p="3" alignItems="center" gap="3">
                <Image
                    src="/departmental-admin/assets/uphcscLG.png"
                    alt="UNIPORT Computer Science"
                    h="12"
                    w="auto"
                    objectFit="contain"
                />
            </Flex>

            <Box as="nav" flex="1" px="4" py="4">
                <Flex direction="column" gap="1">
                    {menuItems.map((item) => (
                        <Box
                            as="button"
                            key={item.label}
                            onClick={() => onViewChange(item.label)}
                            w="full"
                            display="flex"
                            alignItems="center"
                            gap="3"
                            px="3"
                            py="2.5"
                            borderRadius="lg"
                            transition="all 0.2s"
                            bg={activeView === item.label ? "slate.100" : "transparent"}
                            color={activeView === item.label ? "slate.900" : "slate.500"}
                            fontWeight={activeView === item.label ? "semibold" : "normal"}
                            _hover={{
                                bg: activeView === item.label ? "slate.100" : "gray.50",
                                color: "slate.900",
                            }}
                        >
                            <item.icon
                                size={20}
                                color={activeView === item.label ? "#2563eb" : "#94a3b8"}
                            />
                            <Text fontSize="sm">{item.label}</Text>
                        </Box>
                    ))}
                </Flex>
            </Box>

            {onLogout && (
                <Box p="4" borderTop="1px solid" borderColor="gray.200">
                    <Box
                        as="button"
                        onClick={onLogout}
                        w="full"
                        display="flex"
                        alignItems="center"
                        gap="3"
                        px="3"
                        py="2.5"
                        borderRadius="lg"
                        transition="all 0.2s"
                        color="red.600"
                        _hover={{ bg: "red.50" }}
                    >
                        <LogOut size={20} color="#ef4444" />
                        <Text fontSize="sm" fontWeight="medium">Logout</Text>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default Sidebar;
