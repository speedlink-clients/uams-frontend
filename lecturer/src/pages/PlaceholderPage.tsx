import { Heading, Text, Box } from "@chakra-ui/react";
import { useLocation } from "react-router";

const PlaceholderPage = ({ title }: { title: string }) => {
    const location = useLocation();

    return (
        <Box>
            <Heading size="lg" mb="2">{title}</Heading>
            <Text color="gray.500">
                This page is under construction. Route: {location.pathname}
            </Text>
        </Box>
    );
};

export default PlaceholderPage;
