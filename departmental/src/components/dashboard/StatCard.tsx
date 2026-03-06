import { Box, Flex, Text } from "@chakra-ui/react";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    bgColor: string;
    description?: string;
}

export const StatCard = ({ label, value, icon, bgColor, description }: StatCardProps) => {
    return (
        <Flex
            bg={bgColor}
            p="6"
            borderRadius="2xl"
            alignItems="center"
            gap="5"
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.02)" }}
            cursor="default"
            border="1px solid"
            borderColor="blackAlpha.50"
        >
            <Flex
                bg="whiteAlpha.400"
                p="3"
                borderRadius="xl"
                boxShadow="sm"
                color="slate.800"
            >
                {icon}
            </Flex>
            <Box>
                <Text fontSize="xs" fontWeight="medium" color="slate.600" textTransform="uppercase" letterSpacing="wider" mb="1">
                    {label}
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="slate.900">
                    {value}
                </Text>
                {description && (
                    <Text fontSize="xs" color="slate.500" mt="1">{description}</Text>
                )}
            </Box>
        </Flex>
    );
};
