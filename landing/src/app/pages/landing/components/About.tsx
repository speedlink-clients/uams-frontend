import { Box, Container, Flex, Heading, Text, Button, Image, Stack, VStack } from "@chakra-ui/react";
import { toaster } from "@components/ui/toaster";
import { motion } from "framer-motion";

const ABOUT_IMG = "/images/3941bb7f924ec837957d353f2bb7fe7c091f261d (1).png";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const About = () => {
    const handleComingSoon = () => {
        toaster.create({
            title: "Coming Soon",
            description: "Our full institution story is on the way!",
            type: "info",
        });
    };
    return (
        <Box id="about" py={{ base: 12, md: 20 }} bg="white" overflow="hidden">
            <Container maxW="container.xl">
                <MotionFlex
                    direction={{ base: "column", lg: "row" }}
                    gap={{ base: 8, lg: 12 }}
                    align="center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={{
                        hidden: { opacity: 0, y: 50 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.2 } }
                    }}
                >
                    {/* Image Side */}
                    <MotionBox
                        flex={1}
                        w="100%"
                        variants={{
                            hidden: { opacity: 0, x: -50 },
                            visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
                        }}
                    >
                        <Image
                            src={ABOUT_IMG}
                            alt="University Building"
                            borderRadius="none"
                            objectFit="cover"
                            w="100%"
                            h={{ base: "250px", md: "400px" }}

                        />
                    </MotionBox>

                    {/* Text Side */}
                    <MotionBox
                        flex={1}
                        variants={{
                            hidden: { opacity: 0, x: 50 },
                            visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
                        }}
                    >
                        <VStack align={{ base: "center", lg: "flex-start" }} gap={6} textAlign={{ base: "center", lg: "left" }}>
                            <Text color="#2AB0E8" fontWeight="bold" fontSize="lg" letterSpacing="wide" textTransform="uppercase">
                                About Us
                            </Text>
                            <Heading as="h3" size={{ base: "2xl", md: "3xl" }} color="#0C426F">

                                Uniport At A Glance
                            </Heading>

                            <Stack gap={4} color="gray.600" fontSize="md" maxW="lg">
                                <Text>
                                    Founded in 1975, the University of Port Harcourt (UNIPORT) is a second-generation Federal University located in the Niger-Delta region of Nigeria with over 50,000 students and a strong focus in Petroleum Engineering.
                                </Text>
                                <Text>
                                    Formerly known as University College, Port Harcourt, UNIPORT has been ranked amongst the <Text as="span" fontStyle="italic" fontWeight="medium">Top Ten Universities in Africa</Text> and as the first in Nigeria by Times Higher Education (THE); a UK-based source for higher education information.
                                </Text>
                            </Stack>

                            <Button
                                bg="#40C4FF"
                                color="white"
                                size="lg"
                                px={8}
                                borderRadius="none"
                                _hover={{ bg: "#2AB0E8", transform: "translateY(-2px)" }}
                                transition="all 0.2s"
                                onClick={handleComingSoon}
                            >
                                Read More
                            </Button>
                        </VStack>
                    </MotionBox>
                </MotionFlex>
            </Container>
        </Box>
    );
};

export default About;
