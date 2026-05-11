import { Box, Image } from "@chakra-ui/react";

const AuthBackground = () => (
    <Box position="fixed" inset="0" w="full" h="full" zIndex="0">
        <Image
            src={`${import.meta.env.BASE_URL}assets/slider.jpeg`}
            alt="UAMS Login Background"
            position="absolute"
            inset="0"
            w="full"
            h="full"
            objectFit="cover"
        />
        <Box position="absolute" inset="0" bg="blackAlpha.400" />
    </Box>
);

export default AuthBackground;
