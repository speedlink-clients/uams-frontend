import { Box, Container, Flex, Heading, Text, Input, Button } from "@chakra-ui/react";
import { toaster } from "@components/ui/toaster";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const NewsletterSection = () => {
    const handleComingSoon = () => {
        toaster.create({
            title: "Coming Soon",
            description: "Newsletter subscriptions will be active soon.",
            type: "info",
        });
    };
    return (
        <Box bg="#2AB0E826" py={16}>
            <Container maxW="container.xl">
                <MotionBox
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <Flex direction={{ base: "column", md: "row" }} align="center" justify="space-between" gap={8}>

                        <Box maxW="lg">
                            <Heading as="h3" size="3xl" color="#154A99" mb={2}>
                                Join Our Newsletter
                            </Heading>
                            <Text color="#000000" fontSize="sm">
                                Be unique and never miss interesting happenings by joining our newsletter program.
                            </Text>
                        </Box>

                        <Flex gap={3} w={{ base: "100%", md: "auto" }} maxW="md" h="12">
                            <Input
                                placeholder="Your Email Address"
                                bg="transparent"
                                borderColor="#000000"
                                borderRadius="none"
                                _focus={{ borderColor: "#EC9A29", boxShadow: "none" }}
                                h="12"
                                px={4}
                            />
                            <Button
                                bg="#EC9A29"
                                color="white"
                                borderRadius="none"
                                h="12"
                                px={8}
                                _hover={{ bg: "#2AB0E8", transform: "scale(1.05)" }}
                                fontWeight="bold"
                                fontSize="sm"
                                transition="all 0.2s"
                                onClick={handleComingSoon}
                            >
                                SUBSCRIBE
                            </Button>
                        </Flex>

                    </Flex>
                </MotionBox>
            </Container>
        </Box>
    );
};

export default NewsletterSection;
