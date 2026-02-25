import { Box, Flex, Image, Text, Icon } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router";
import { LogOut } from "lucide-react";
import sidebarItems from "@configs/sidebar.config";
import useAuthStore from "@stores/auth.store";
import useUserStore from "@stores/user.store";

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearAuth } = useAuthStore();
    const { clearUser } = useUserStore();

    const handleLogout = () => {
        clearAuth();
        clearUser();
        navigate("/login");
    };
    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + "/");
    };

    return (
        <Flex
            as="nav"
            direction="column"
            width="255px"
            minH="100vh"
            bg="white"
            borderRight="1px solid"
            borderColor="gray.200"
            position="fixed"
            top="8px"
            left="0"
            zIndex="10"
        >
            {/* University Logo / Branding */}
            <Box px="5" py="5" borderBottom="1px solid" borderColor="gray.100">
                <Image
                    src="/lecturer/assets/sidebar-image.png"
                    alt="University of Port Harcourt"
                    width="98%"
                    mb="2"
                />
            </Box>

            {/* Navigation Items */}
            <Flex direction="column" gap="1" px="4" py="4" flex="1">
                {sidebarItems.map((item) => {
                    const active = isActive(item.path);

                    return (
                        <Flex
                            key={item.path}
                            align="center"
                            gap="3"
                            px="3"
                            py="2.5"
                            borderRadius="md"
                            cursor="pointer"
                            bg={active ? "#f8fafc" : "transparent"}
                            color={active ? "accent.500" : "gray.600"}
                            fontWeight={active ? "600" : "500"}
                            fontFamily={"sans-serif"}
                            transition="all 0.15s ease"
                            _hover={{
                                bg: active ? "accent.50" : "gray.50",
                                color: active ? "accent.500" : "gray.800",
                            }}
                            onClick={() => navigate(item.path)}
                        >
                            <Icon
                                as={item.icon}
                                boxSize="5"
                                strokeWidth={active ? 2.2 : 1.8}
                            />
                            <Text fontSize="sm">{item.label}</Text>
                        </Flex>
                    );
                })}
            </Flex>

            {/* Logout Button */}
            <Box px="4" pb="5">
                <Flex
                    align="center"
                    gap="3"
                    px="4"
                    py="2.5"
                    borderRadius="md"
                    cursor="pointer"
                    color="red.500"
                    fontWeight="700"
                    transition="all 0.15s ease"
                    _hover={{
                        bg: "red.100",
                        color: "red.600",
                    }}
                    onClick={handleLogout}
                >
                    <Icon as={LogOut} boxSize="5" strokeWidth={1.8} />
                    <Text fontSize="sm">Logout</Text>
                </Flex>
            </Box>
        </Flex>
    );
};

export default Sidebar;
