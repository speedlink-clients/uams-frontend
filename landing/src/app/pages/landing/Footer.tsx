import { Box, Container, SimpleGrid, Text, Stack, Link, Image, Flex, HStack } from "@chakra-ui/react";
import { toaster } from "@components/ui/toaster";
import { Facebook, Twitter, Linkedin, Instagram, Phone, Mail } from "lucide-react";

const Footer = () => {
    const handleComingSoon = () => {
        toaster.create({
            title: "Coming Soon",
            description: "This portal will be available soon.",
            type: "info",
        });
    };
    return (
        <Box bg="#154A99" color="white" py={{ base: 12, md: 16 }}>
            <Container maxW="container.xl">
                <SimpleGrid columns={{ base: 2, lg: 4 }} gap={{ base: 8, md: 12 }} mb={16}>

                    <Stack gap={6} gridColumn={{ base: "1 / -1", lg: "auto" }}>
                        {/* Logo */}
                        <HStack gap={{ base: -2, md: -4 }} align="center">
                            <Image src="/images/uniport-crest.png" alt="Uniport Crest" h="70px" objectFit="contain" />
                            <Image
                                src="/images/uniport-logo-text.png"
                                alt="University of Port Harcourt"
                                h="70px"
                                objectFit="contain"
                                filter="brightness(0) invert(1)"
                            />
                        </HStack>

                        <Box fontSize="sm" color="gray.300">
                            <Text mb={4}>
                                University of Port Harcourt, East/West Road,
                                PMB 5323 Choba, Rivers State, Nigeria
                            </Text>

                            <Stack gap={3}>
                                <Flex align="center" gap={3}>
                                    <Phone size={16} color="#2AB0E8" />
                                    <Text color="white">Hot Line: +23404017041</Text>
                                </Flex>
                                <Flex align="center" gap={3}>
                                    <Mail size={16} color="#2AB0E8" />
                                    <Link href="mailto: helpdesk@uniport.edu.ng" color="white">Email: helpdesk@uniport.edu.ng</Link>
                                </Flex>
                            </Stack>
                        </Box>

                        <Flex gap={4}>
                            {[Facebook, Twitter, Instagram, Linkedin].map((IconComp, i) => (
                                <Box key={i} border="1px solid" borderColor="white" borderRadius="full" p={2} _hover={{ bg: "#2AB0E8", borderColor: "#2AB0E8" }} cursor="pointer" onClick={handleComingSoon}>
                                    <IconComp size={18} />
                                </Box>
                            ))}
                        </Flex>
                    </Stack>

                    <Stack gap={4} align="flex-start" justifySelf={{ base: "flex-start", lg: "end" }}>
                        <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }}>Quick Links</Text>
                        <Stack gap={2} align="flex-start">
                            {["Admissions", "Recent News", "Academic Calendar", "Uniport Weekly", "Payment for Transcript", "Access Digital Library"].map(link => (
                                <Link key={link} href="#" fontSize={{ base: "xs", md: "sm" }} color="gray.100" _hover={{ color: "#2AB0E8" }} onClick={handleComingSoon}>{link}</Link>
                            ))}
                        </Stack>
                    </Stack>

                    <Stack gap={4} align="flex-start" justifySelf={{ base: "flex-start", lg: "end" }}>
                        <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }}>Navigation</Text>
                        <Stack gap={2} align="flex-start">
                            {["Home", "About", "Research", "Collaborations", "Admissions", "Updates"].map(link => (
                                <Link key={link} href="#" fontSize={{ base: "xs", md: "sm" }} color="gray.100" _hover={{ color: "#2AB0E8" }} onClick={handleComingSoon}>{link}</Link>
                            ))}
                        </Stack>
                    </Stack>


                </SimpleGrid>

                <Box borderTop="1px solid" borderColor="#FFFF" pt={8} textAlign="center">
                    <Text fontSize="xs" color="white">
                        Copyright © 2026 Department of Computer Science, Faculty of Computing, University of Port Harcourt
                    </Text>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
