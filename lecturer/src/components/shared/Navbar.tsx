import { Flex, Text, Box, Icon, Avatar, Separator } from "@chakra-ui/react";
import { Bell } from "lucide-react";
import useAuthStore from "@stores/auth.store";

const Navbar = () => {
  const { user } = useAuthStore();

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
      borderColor="border.muted"
    >
      {/* Notification Bell */}
      <Icon as={Bell} boxSize="5" color="fg.muted" cursor="pointer" />

      {/* Divider */}
       <Separator orientation="vertical" height="6" />

      {/* User Info + Avatar */}
      <Flex align="center" gap="3">
        {/* Name & Email */}
        <Box textAlign="right">
          <Text fontSize="sm" fontWeight="600" color="fg.muted" lineHeight="1.3">
            {user?.name || "N/A"}
          </Text>
          <Text fontSize="xs" color="fg.subtle" lineHeight="1.3">
            {user?.email || "N/A"}
          </Text>
        </Box>

        {/* Avatar */}
    
          <Avatar.Root size="md">
            <Avatar.Fallback name={user?.name} />
          </Avatar.Root>
      </Flex>
    </Flex>
  );
};

export default Navbar;