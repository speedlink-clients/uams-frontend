import {
    Box,
    Flex,
    HStack,
    Link,
    Text,
    Button,
    Container,
    Image,
    IconButton,
    Stack,
} from "@chakra-ui/react";
import { toaster } from "@components/ui/toaster";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import LoginModal from "@components/shared/LoginModal";

const LOGO_SRC = "/images/a7f14cb8262ed215ba9b9d5819404f20e896d5cc.png";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const openLogin = () => setIsLoginOpen(true);
    const closeLogin = () => setIsLoginOpen(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleComingSoon = (e: React.MouseEvent) => {
        e.preventDefault();
        toaster.create({
            title: "Coming Soon",
            description: "This page is currently under development.",
            type: "info",
        });
    };

    const navLinks = ["Home", "About", "Research", "Collaborations", "Admissions", "Updates"];

    return (
        <>
            <Box as="nav" position="sticky" top={0} zIndex={100} bg="white" boxShadow="sm">
                {/* Main Header */}
                <Container maxW="container.xl" py={4}>
                    <Flex justify="space-between" align="center">
                        {/* Logo */}
                        <HStack gap={4}>
                            <Image src={LOGO_SRC} alt="Uniport" h={{ base: "45px", md: "65px" }} objectFit="contain" />
                        </HStack>

                        {/* Desktop Nav Links */}
                        <HStack gap={8} display={{ base: "none", lg: "flex" }}>
                            {navLinks.map((item) => (
                                <Link key={item} href="#" color="gray.600" _hover={{ color: "#2AB0E8" }} fontSize="sm" fontWeight="medium" onClick={handleComingSoon}>
                                    {item}
                                </Link>
                            ))}
                        </HStack>

                        {/* Actions */}
                        <HStack gap={{ base: 2, md: 4 }}>
                            <IconButton aria-label="Search" variant="ghost" size="sm">
                                <Search size={20} color="gray" />
                            </IconButton>
                            <Button
                                colorScheme="cyan"
                                bg="#2AB0E8"

                                color="white"
                                size={{ base: "xs", md: "sm" }}
                                px={{ base: 4, md: 6 }}
                                borderRadius="none"
                                _hover={{ bg: "#2AB0E8" }}
                                display={{ base: "none", sm: "inline-flex" }}
                                onClick={openLogin}
                            >
                                Login
                            </Button>


                            {/* Mobile Menu Toggle */}
                            <IconButton
                                display={{ base: "flex", lg: "none" }}
                                aria-label="Toggle Navigation"
                                variant="ghost"
                                onClick={toggleMenu}
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </IconButton>
                        </HStack>
                    </Flex>
                </Container>

                {/* Admission Bar (Now below the header) */}
                <Box bg="#4CC5F5" py={2}>

                    <Container maxW="container.xl">
                        <Flex justify="center" align="center" gap={2} fontSize={{ base: "xs", md: "sm" }} color="white" flexWrap="wrap">
                            <Text textAlign="center">
                                Admission for the January 2026 academic session is ongoing.
                            </Text>
                            <Link href="#" fontWeight="bold" textDecoration="underline" color="white" onClick={handleComingSoon}>
                                Apply Now!
                            </Link>
                        </Flex>
                    </Container>
                </Box>

                {/* Mobile Menu Overlay */}
                {isOpen && (
                    <Box
                        display={{ base: "block", lg: "none" }}
                        bg="white"
                        borderTop="1px solid"
                        borderColor="gray.100"
                        pb={8}
                        px={4}
                        position="absolute"
                        top="100%"
                        left={0}
                        right={0}
                        boxShadow="md"
                    >
                        <Stack gap={4} py={4}>
                            {navLinks.map((item) => (
                                <Link key={item} href="#" fontSize="md" fontWeight="medium" color="gray.700" onClick={(e) => { setIsOpen(false); handleComingSoon(e); }}>
                                    {item}
                                </Link>
                            ))}
                            <Button
                                bg="#40C4FF"
                                color="white"
                                w="100%"
                                borderRadius="none"
                                onClick={() => { setIsOpen(false); openLogin(); }}
                            >
                                Login
                            </Button>
                        </Stack>
                    </Box>
                )}

            </Box>

            <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
        </>
    );
};

export default Navbar;
