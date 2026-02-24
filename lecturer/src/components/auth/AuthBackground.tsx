import { Box, Image } from "@chakra-ui/react";

const AuthBackground = () => (
    <Box position="fixed" inset="0" w="100%" h="100%" zIndex={0}>
        <Image
            src={`${import.meta.env.BASE_URL}assets/login-background-image.jpeg`}
            alt="UAMS Login Background"
            position="absolute"
            inset="0"
            w="100%"
            h="100%"
            objectFit="cover"
        />
        <Box position="absolute" inset="0" bg="blackAlpha.600" />
    </Box>
);

export default AuthBackground;
