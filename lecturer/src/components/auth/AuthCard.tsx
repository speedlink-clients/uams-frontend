import { Box, Flex, Image } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface AuthCardProps {
    children: ReactNode;
}

const AuthCard = ({ children }: AuthCardProps) => (
    <Box
        position="relative"
        zIndex={10}
        w="100%"
        maxW="500px"
        bg="white"
        px={{ base: "8", md: "12" }}
        py={{ base: "8", md: "12" }}
        borderRadius="3xl"
        boxShadow="2xl"
        mx="4"
    >
        <Flex justify="center" mb="8">
            <Image
                src={`${import.meta.env.BASE_URL}assets/sidebar-image.png`}
                alt="UniEdu Logo"
                h="12"
                onError={(e: any) => {
                    e.currentTarget.style.display = "none";
                }}
            />
        </Flex>
        {children}
    </Box>
);

export default AuthCard;
