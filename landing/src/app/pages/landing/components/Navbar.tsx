import {
    Box,
    Flex,
    HStack,
    Link,
    Button,
    Container,
    Image,
    IconButton,
    Stack,
} from "@chakra-ui/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import LoginModal from "@components/shared/LoginModal";

const LOGO_SRC = "/images/a7f14cb8262ed215ba9b9d5819404f20e896d5cc.png";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const navigate = useNavigate();

    const openLogin = () => setIsLoginOpen(true);
    const closeLogin = () => setIsLoginOpen(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleNavClick = (href: string) => {
        if (href.startsWith("#")) {
            const id = href.substring(1);
            if (window.location.pathname !== "/") {
                navigate("/");
                setTimeout(() => scrollToSection(id), 100);
            } else {
                scrollToSection(id);
                // Update URL without reloading page
                window.history.pushState(null, "", href);
            }
        } else {
            window.location.href = href;
        }
    };

    const navLinks = [
        { label: "Home", href: "#home" },
        { label: "About", href: "#about" },
        { label: "Research", href: "#research" },
        { label: "Collaborations", href: "https://www.uniport.edu.ng/" },
        { label: "Admissions", href: "https://www.uniport.edu.ng/" },
        { label: "Updates", href: "https://www.uniport.edu.ng/" }
    ];

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
                                <Link 
                                    key={item.label} 
                                    onClick={() => handleNavClick(item.href)}
                                    color="gray.600" 
                                    _hover={{ color: "#2AB0E8", cursor: "pointer" }} 
                                    fontSize="sm" 
                                    fontWeight="medium"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </HStack>

                        {/* Actions */}
                        <HStack gap={{ base: 2, md: 4 }}>
                            <Button
                                bg="#2AB0E8"
                                color="white"
                                size={{ base: "xs", md: "sm" }}
                                px={{ base: 3, md: 6 }}
                                borderRadius="none"
                                _hover={{ bg: "#23a1d5" }}
                                // Button is now always visible
                                display="inline-flex"
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

                {/* Admission Bar
                <Box bg="#4CC5F5" py={2}>
                    <Container maxW="container.xl">
                        <Flex justify="center" align="center" gap={2} fontSize={{ base: "xs", md: "sm" }} color="white" flexWrap="wrap">
                            <Text textAlign="center">
                                Admission for the January 2026 academic session is ongoing.
                            </Text>
                            <Link href="https://www.uniport.edu.ng/" fontWeight="bold" textDecoration="underline" color="white">
                                Apply Now!
                            </Link>
                        </Flex>
                    </Container>
                </Box> */}

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
                        <Stack gap={1} py={4}>
                            {navLinks.map((item) => (
                                <Link 
                                    key={item.label} 
                                    onClick={() => { setIsOpen(false); handleNavClick(item.href); }}
                                    fontSize="md" 
                                    fontWeight="medium" 
                                    color="gray.700" 
                                    py={3} // Added padding for better mobile touch targets
                                    _hover={{ cursor: "pointer" }}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            {/* Login Button removed from here as it is persistent in the header */}
                        </Stack>
                    </Box>
                )}
            </Box>

            <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
        </>
    );
};

export default Navbar;