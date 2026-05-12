import { Box, Text } from "@chakra-ui/react";

interface StatCardProps {
    label: string;
    value: number | string;
    colorScheme?: "green" | "pink"; 
}

const StatCard = ({ label, value }: StatCardProps) => {
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
            <Text fontSize="25px" fontWeight="bold" color="fg.muted">
                {value}
            </Text>
        </Box>
    );
};

export default StatCard;