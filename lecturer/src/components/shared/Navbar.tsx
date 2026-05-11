import { Flex, Text, Box, Icon, Avatar, AvatarGroup } from "@chakra-ui/react";
import { Bell } from "lucide-react";
import useUserStore from "@stores/user.store";

const Navbar = () => {
  const { user } = useUserStore();

  // Get initials for avatar fallback
  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const profileImage = user?.avatar;

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
      <Icon as={Bell} boxSize="5" color="gray.500" cursor="pointer" />

      {/* Divider */}
      <Box h="38px" w="1px" bg="gray.200" mx="1" />

      {/* User Info + Avatar */}
      <Flex align="center" gap="3">
        {/* Name & Email */}
        <Box textAlign="right">
          <Text fontSize="sm" fontWeight="600" color="gray.800" lineHeight="1.3">
            {user?.fullName || "User"}
          </Text>
          <Text fontSize="xs" color="gray.500" lineHeight="1.3">
            {user?.email || "user@example.com"}
          </Text>
        </Box>

        {/* Avatar with status dot */}
        <Box position="relative">
            <AvatarGroup>
          <Avatar.Root size="md">
            <Avatar.Fallback>{initials}</Avatar.Fallback>
            <Avatar.Image src={profileImage} alt={user?.fullName || "User"} />
          </Avatar.Root>
          </AvatarGroup>

          {/* Online status dot */}
          <Box
            position="absolute"
            bottom="0"
            right="0"
            w="10px"
            h="10px"
            borderRadius="full"
            bg="#22c55e"
            border="2px solid white"
          />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Navbar;