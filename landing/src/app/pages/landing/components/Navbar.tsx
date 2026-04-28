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

const LOGO_SRC = "/images/a7f14cb8262ed215ba9b9d5819404f20e896d5cc.png";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

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
                            <Link
                                onClick={() => navigate("/auth/login")}
                                bg="#2AB0E8"
                                color="white"
                                px={{ base: 3, md: 6 }}
                                py={{ base: 1.5, md: 2 }}
                                borderRadius="none"
                                _hover={{ 
                                    bg: "#23a1d5",
                                    textDecoration: "none",
                                    cursor: "pointer"
                                }}
                                display="inline-flex"
                                alignItems="center"
                                justifyContent="center"
                                fontSize={{ base: "xs", md: "sm" }}
                                fontWeight="medium"
                                transition="all 0.2s"
                            >
                                Login
                            </Link>

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
                                    py={3}
                                    _hover={{ cursor: "pointer" }}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </Stack>
                    </Box>
                )}
            </Box>
        </>
    );
};

export default Navbar;