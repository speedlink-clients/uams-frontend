import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const HERO_IMAGES = [
    "/images/3941bb7f924ec837957d353f2bb7fe7c091f261d (1).png",
    "/images/28efe5d2b49d90b5dbeeca9c4965f70da3420edb (1).jpg",
    "/images/5ed7d0d339dcca3293a16471198e6e0fd0d1bb46.jpg",
    "/images/1674211baaaa404517eb9568df8471f36160c5b9.jpg",
    "/images/jdjdjdjd.jpeg"
];

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

const Hero = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box
            id="hero"
            position="relative"
            h={{ base: "450px", md: "600px" }}
            overflow="hidden"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="#003366"
        >
            {/* Background Images with Fade Transition */}
            {HERO_IMAGES.map((img, index) => (
                <Box
                    key={index}
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    backgroundImage={`url('${img}')`}
                    backgroundSize="cover"
                    backgroundPosition="center"
                    opacity={index === currentImageIndex ? 1 : 0}
                    transition="opacity 1.5s ease-in-out"
                    zIndex={0}
                />
            ))}

            {/* Blue Overlay */}
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="rgba(0, 50, 100, 0.4)"
                zIndex={1}
            />

            <Container maxW="container.xl" position="relative" zIndex={2} centerContent px={4}>
                <MotionVStack
                    gap={{ base: 4, md: 6 }}
                    textAlign="center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <MotionBox
                        bg="white"
                        px={{ base: 4, md: 8 }}
                        py={{ base: 3, md: 4 }}
                        borderRadius="none"
                        boxShadow="lg"
                        w={{ base: "full", sm: "auto" }}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <Heading as="h1" size={{ base: "lg", md: "xl" }} color="#0C426F"
                            textTransform="uppercase" letterSpacing="wide">
                            Building the Next Generation
                        </Heading>
                    </MotionBox>

                    <MotionBox
                        bg="white"
                        px={{ base: 4, md: 8 }}
                        py={{ base: 3, md: 4 }}
                        borderRadius="none"
                        boxShadow="lg"
                        w={{ base: "full", sm: "auto" }}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <Heading as="h2" size={{ base: "lg", md: "xl" }} color="#0C426F">
                            of <Text as="span" fontWeight="bold">Technology Experts</Text>
                        </Heading>
                    </MotionBox>

                    <MotionBox
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                    >
                        <Text color="white" fontSize={{ base: "md", md: "lg" }} maxW="2xl" textShadow="0 2px 4px rgba(0,0,0,0.5)">
                            Become part of a dynamic institution recognized for its high-impact research and commitment to shaping the future.
                        </Text>
                    </MotionBox>

                    {/* Carousel dots */}
                    <Box display="flex" gap={2} mt={{ base: 4, md: 8 }}>
                        {HERO_IMAGES.map((_, index) => (
                            <Box
                                key={index}
                                w={3}
                                h={3}
                                borderRadius="100%"
                                bg={index === currentImageIndex ? "#2AB0E8" : "whiteAlpha.600"}
                                border="1px solid white"
                                cursor="pointer"
                                onClick={() => setCurrentImageIndex(index)}
                                transition="all 0.3s"
                            />
                        ))}
                    </Box>
                </MotionVStack>
            </Container>
        </Box>
    );
};

export default Hero;
