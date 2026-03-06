import { Box, Flex, Image } from "@chakra-ui/react";

interface AuthCardProps {
    children: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ children }) => (
    <Box
        position="relative"
        zIndex="10"
        w="full"
        maxW="500px"
        bg="white"
        p={{ base: "8", md: "12" }}
        borderRadius="3xl"
        boxShadow="2xl"
        mx="4"
    >
        <Flex justifyContent="center" mb="8">
            <Image
                src={`${import.meta.env.BASE_URL}assets/uphcscLG.png`}
                alt="UniEdu Logo"
                h="12"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.style.display = "none";
                }}
            />
        </Flex>
        {children}
    </Box>
);

export default AuthCard;
