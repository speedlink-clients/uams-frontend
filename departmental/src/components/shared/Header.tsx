import { Bell, History, Menu } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { ViewType } from '@type/common.type';
import { Box, Flex, Text, Image } from '@chakra-ui/react';

interface HeaderProps {
    onViewChange: (view: ViewType) => void;
    currentUser?: string;
    email?: string;
    onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onViewChange, currentUser = 'Dept. Admin', email, onMenuClick }) => {
    const navigate = useNavigate();

    return (
        <Flex
            as="header"
            h="16"
            bg="white"
            borderBottom="1px solid"
            borderColor="gray.200"
            alignItems="center"
            justifyContent="space-between"
            px={{ base: "4", md: "8" }}
            position="sticky"
            top="0"
            zIndex="40"
            gap="4"
        >
            <Flex alignItems="center" gap="4" flex="1">
                <Box
                    as="button"
                    onClick={onMenuClick}
                    display={{ base: "block", lg: "none" }}
                    p="2"
                    borderRadius="md"
                    _hover={{ bg: "slate.100" }}
                >
                    <Menu size={24} color="#64748b" />
                </Box>
                <Box maxW="lg" w="full" />
            </Flex>

            <Flex alignItems="center" gap="6">
                <Flex
                    alignItems="center"
                    gap="4"
                    color="slate.500"
                    borderRight="1px solid"
                    borderColor="gray.200"
                    pr="6"
                >
                    <Box
                        as="button"
                        onClick={() => navigate('/notifications')}
                        position="relative"
                        _hover={{ color: "blue.600" }}
                        transition="all 0.2s"
                        p="2"
                        borderRadius="lg"
                    >
                        <Bell size={20} />
                        <Box
                            position="absolute"
                            top="2"
                            right="2"
                            w="2"
                            h="2"
                            bg="rose.500"
                            borderRadius="full"
                            border="2px solid white"
                        />
                    </Box>
                    <Box
                        as="button"
                        _hover={{ color: "blue.600" }}
                        transition="all 0.2s"
                        p="2"
                        borderRadius="lg"
                    >
                        <History size={20} />
                    </Box>
                </Flex>

                <Box
                    as="button"
                    onClick={() => onViewChange('Profile')}
                    display="flex"
                    alignItems="center"
                    gap="3"
                    _hover={{ bg: "slate.50" }}
                    p="1"
                    pr="3"
                    borderRadius="xl"
                    transition="all 0.2s"
                >
                    <Box textAlign="right" display={{ base: "none", sm: "block" }}>
                        <Text fontSize="sm" fontWeight="semibold" color="slate.900" lineHeight="none">
                            {currentUser}
                        </Text>
                        <Text fontSize="xs" color="slate.500" mt="1">
                            {email || 'deptadmin@uniport.edu.ng'}
                        </Text>
                    </Box>
                    <Flex
                        w="10"
                        h="10"
                        borderRadius="full"
                        bg="slate.100"
                        border="1px solid"
                        borderColor="gray.200"
                        alignItems="center"
                        justifyContent="center"
                        overflow="hidden"
                        boxShadow="sm"
                    >
                        <Image
                            src="https://picsum.photos/seed/admin/40/40"
                            alt="Profile"
                            w="full"
                            h="full"
                            objectFit="cover"
                        />
                    </Flex>
                </Box>
            </Flex>
        </Flex>
    );
};

export default Header;
