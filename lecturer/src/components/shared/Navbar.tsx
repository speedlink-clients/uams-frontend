import { Flex, Text, Box, Icon, Avatar } from "@chakra-ui/react";
import { Bell } from "lucide-react";
import useUserStore from "@stores/user.store";

const Navbar = () => {
  const { user } = useUserStore();

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
      borderColor="border.subtle"
    >
      {/* Notification Bell */}
      <Icon as={Bell} boxSize="5" color="fg.muted" cursor="pointer" />

      {/* Divider */}
      <Box h="38px" w="1px" bg="fg.subtle" mx="1" />

      {/* User Info + Avatar */}
      <Flex align="center" gap="3">
        {/* Name & Email */}
        <Box textAlign="right">
          <Text fontSize="sm" fontWeight="600" color="gray.800" lineHeight="1.3">
            {user?.name || "N/A"}
          </Text>
          <Text fontSize="xs" color="gray.500" lineHeight="1.3">
            {user?.email || "N/A"}
          </Text>
        </Box>

        {/* Avatar */}
    
          <Avatar.Root size="md">
            <Avatar.Fallback>{user?.name}</Avatar.Fallback>
          </Avatar.Root>
      </Flex>
    </Flex>
  );
};

export default Navbar;