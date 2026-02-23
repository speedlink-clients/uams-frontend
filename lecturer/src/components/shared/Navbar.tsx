import { Flex, Text, Box, Icon } from "@chakra-ui/react";
import { Bell, Clock } from "lucide-react";
import useUserStore from "@stores/user.store";

const Navbar = () => {
    const { name, email } = useUserStore();

    // Get initials for avatar fallback
    const initials = name
        ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";

    return (
        <Flex
            as="header"
            align="center"
            justify="flex-end"
            gap="4"
            px="6"
            py="3"
            bg="white"
            borderBottom="1px solid"
            borderColor="gray.100"
        >
            {/* Notification Bell */}
            <Icon
                as={Bell}
                boxSize="5"
                color="gray.500"
                cursor="pointer"
                _hover={{ color: "gray.700" }}
            />

            {/* History / Clock */}
            <Icon
                as={Clock}
                boxSize="5"
                color="gray.500"
                cursor="pointer"
                _hover={{ color: "gray.700" }}
            />

            {/* User Avatar + Info */}
            <Flex align="center" gap="3" ml="2">
                <Box
                    w="36px"
                    h="36px"
                    borderRadius="full"
                    bg="gray.200"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Text fontSize="sm" fontWeight="600" color="gray.600">
                        {initials}
                    </Text>
                </Box>
                <Box>
                    <Text fontSize="sm" fontWeight="600" color="gray.800" lineHeight="1.3">
                        {name || "User"}
                    </Text>
                    <Text fontSize="xs" color="gray.500" lineHeight="1.3">
                        {email || "user@example.com"}
                    </Text>
                </Box>
            </Flex>
        </Flex>
    );
};

export default Navbar;
