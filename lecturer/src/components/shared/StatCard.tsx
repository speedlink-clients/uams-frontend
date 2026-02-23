import { Box, Flex, Text } from "@chakra-ui/react";

interface StatCardProps {
    label: string;
    value: number;
    colorScheme: "green" | "pink";
}

const colorMap = {
    green: {
        bg: "#DCFCE7",
        text: "#16A34A",
    },
    pink: {
        bg: "#FDE2E2",
        text: "#EF4444",
    },
} as const;

const StatCard = ({ label, value, colorScheme }: StatCardProps) => {
    const colors = colorMap[colorScheme];

    return (
        <Box
            bg="white"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.100"
            px="8"
            py="7"
            flex="1"
            boxShadow="sm"
        >
            <Text fontSize="15px" fontWeight="500" color="gray.700" mb="2.5">
                {label}
            </Text>
            <Flex
                display="inline-flex"
                align="center"
                justify="center"
                bg={colors.bg}
                color={colors.text}
                fontWeight="700"
                fontSize="12px"
                borderRadius="md"
                px="3.5"
                py="1"
                minW="36px"
            >
                {value}
            </Flex>
        </Box>
    );
};

export default StatCard;
