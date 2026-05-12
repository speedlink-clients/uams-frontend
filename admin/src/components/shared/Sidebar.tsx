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
    X,
} from "lucide-react";
import type { ViewType } from "@type/common.type";
import { Box, Flex, Text, Image, Portal } from "@chakra-ui/react";

interface SidebarProps {
    activeView: ViewType;
    onViewChange: (view: ViewType) => void;
    onLogout?: () => void;
    isOpen?: boolean;
    onClose?: () => void;
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

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, onLogout, isOpen = false, onClose }) => {
    const handleNavigation = (view: ViewType) => {
        onViewChange(view);
        if (onClose) onClose();
    };

    return (
        <>
            {/* Mobile Backdrop overlay */}
            {isOpen && (
                <Portal>
                    <Box
                        position="fixed"
                        inset="0"
                        bg="blackAlpha.600"
                        zIndex="40"
                        display={{ base: "block", lg: "none" }}
                        onClick={onClose}
                    />
                </Portal>
            )}

            <Box
                as="aside"
                w="64"
            bg="white"
            h="100vh"
            borderRight="xs"
            borderColor="border.muted"
            display="flex"
            flexDirection="column"
            position="fixed"
            left="0"
            top="0"
            zIndex="50"
            transform={{ base: isOpen ? "translateX(0)" : "translateX(-100%)", lg: "translateX(0)" }}
            transition="transform 0.3s ease-in-out"
        >
            <Flex p="3" alignItems="center" justifyContent="space-between" gap="3" borderBottom={{ base: "xs", lg: "none" }} borderColor="border.muted">
                <Image
                    src="/departmental-admin/assets/uphcscLG.png"
                    alt="UNIPORT Computer Science"
                    h="12"
                    w="auto"
                    objectFit="contain"
                />
                <Box
                    as="button"
                    display={{ base: "block", lg: "none" }}
                    onClick={onClose}
                    p="2"
                    color="fg.muted"
                    _hover={{ bg: "fg.subtle", borderRadius: "md" }}
                >
                    <X size={20} />
                </Box>
            </Flex>

            <Box as="nav" flex="1" px="4" py="4">
                <Flex direction="column" gap="1">
                    {menuItems.map((item) => (
                        <Box
                            as="button"
                            key={item.label}
                            onClick={() => handleNavigation(item.label)}
                            w="full"
                            display="flex"
                            alignItems="center"
                            gap="3"
                            px="3"
                            py="2.5"
                            borderRadius="lg"
                            transition="all 0.2s"
                            bg={activeView === item.label ? "accent.subtle" : "transparent"}
                            color={activeView === item.label ? "accent" : "fg.subtle"}
                            fontWeight="semibold"
                            _hover={{
                                bg: activeView === item.label ? "fg.subtle" : "gray.50",
                                color: "fg.muted",
                            }}
                        >
                            <item.icon
                                size={20}
                            />
                            <Text fontSize="sm">{item.label}</Text>
                        </Box>
                    ))}
                </Flex>
            </Box>

            {onLogout && (
                <Box p="4" borderTop="xs" borderColor="border.muted">
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
        </>
    );
};

export default Sidebar;
