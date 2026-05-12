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
            rounded="md"
            border="1px solid"
            borderColor="bg.muted"
            px="8"
            py="7"
            flex="1"
        >
            <Text fontSize="15px" color="fg.muted" mb="2.5">
                {label}
            </Text>
            <Flex
                display="inline-flex"
                align="center"
                justify="center"
                bg={colors.bg}
                color={colors.text}
                fontSize="12px"
                rounded="md"
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
