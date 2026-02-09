import { Box, Button, Container, Flex, Heading, Stack, Image, Text } from "@chakra-ui/react";
import { toaster } from "@components/ui/toaster";
import { BadgePercent } from "lucide-react";
import { motion } from "framer-motion";

const STUDENT_IMG = "/images/44ff80138d7e107798f043b8426e57d7a0f08f32.png";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const SecureFuture = () => {
    const handleComingSoon = () => {
        toaster.create({
            title: "Coming Soon",
            description: "Registration for our training programs will open shortly.",
            type: "info",
        });
    };
    const features = [
        { text: "Up to 100% Discount on Training Fees", icon: BadgePercent },
        { text: "Tutor-Led Training at an Affordable Rate", icon: BadgePercent },
        { text: "6-12 Months Access to Labs & Study Materials", icon: BadgePercent },
        { text: "Earn Globally Recognized Certifications", icon: BadgePercent }
    ];

    return (
        <Box id="research" bg="#154A99" py={{ base: 12, md: 16 }} position="relative" overflow="hidden">
            <Container maxW="container.xl">
                <Flex direction={{ base: "column", md: "row" }} align="center" justify="space-between" gap={10}>

                    <MotionBox
                        flex={1}
                        color="white"
                        textAlign={{ base: "center", md: "left" }}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <Heading as="h3" size={{ base: "2xl", md: "3xl" }} mb={-2}>
                            Secure Your Future in
                        </Heading>

                        <Heading as="h3" size={{ base: "2xl", md: "3xl" }} mb={6}>
                            Tech Now!!!
                        </Heading>

                        <Box bg="#EBFFFF" borderRadius="12px" p={{ base: 4, md: 6 }} color="gray.800" mb={8} maxW="lg" mx={{ base: "auto", md: "0" }}>
                            <Stack gap={4} align={{ base: "flex-start" }}>
                                {features.map((item, i) => (
                                    <MotionFlex
                                        key={i}
                                        align="start"
                                        gap={3}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + (i * 0.1) }}
                                    >
                                        <Box as={item.icon} color="#000000" mt={1} flexShrink={0} />
                                        <Text fontSize={{ base: "sm", md: "md" }} textAlign="left" color="#000000">{item.text}</Text>
                                    </MotionFlex>
                                ))}
                            </Stack>
                        </Box>

                        <Button
                            bg="#2AB0E8"
                            color="white"
                            size="lg"
                            px={10}
                            borderRadius="none"
                            _hover={{ bg: "#2AB0E8", scale: 1.05 }}
                            fontWeight="bold"
                            w={{ base: "full", sm: "auto" }}
                            transition="all 0.2s"
                            width="89%" padding="2"
                            onClick={handleComingSoon}
                        >
                            Get Started Now
                        </Button>
                    </MotionBox>

                    <MotionBox
                        flex={1}
                        display="flex"
                        justifyContent={{ base: "center", md: "flex-end" }}
                        w="100%"
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, type: "spring" }}
                    >
                        <Image
                            src={STUDENT_IMG}
                            alt="Student"
                            borderRadius="12px"
                            border="4px solid white"
                            maxH={{ base: "300px", md: "400px" }}
                            w="100%"
                            objectFit="cover"
                            boxShadow="2xl"
                        />
                    </MotionBox>
                </Flex>
            </Container>
        </Box>
    );
};

export default SecureFuture;
