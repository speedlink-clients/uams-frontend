import {
    Box,
    Container,
    Flex,
    Heading,
    Text,
    Input,
    SimpleGrid,
    Button,
    VStack,
    HStack,
    IconButton,
} from "@chakra-ui/react";
import { toaster } from "@components/ui/toaster";
import { Search, ChevronRight, CircleChevronRight, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

const programmes = [
    { title: "MSc in Computer Science", courses: 15 },
    { title: "MSc in Programming", courses: 19 },
    { title: "MSc in Cybersecurity", courses: 25 },
];

const MotionBox = motion(Box);

const Programmes = () => {
    const handleComingSoon = () => {
        toaster.create({
            title: "Coming Soon",
            description: "Detailed programme information will be available soon.",
            type: "info",
        });
    };
    return (
        <Box id="programmes" py={{ base: 10, md: 16 }} bg="white">
            <Container maxW="container.xl">
                <VStack align="stretch" gap={8}>

                    <Flex justify="space-between" align={{ base: "start", md: "center" }} direction={{ base: "column", md: "row" }} gap={6}>
                        <Box textAlign={{ base: "center", md: "left" }} w="100%">
                            <Text color="#2AB0E8" fontWeight="bold" fontSize="md" letterSpacing="wide" textTransform="uppercase" mb={2}>
                                FACULTY
                            </Text>
                            <Heading as="h2" size={{ base: "xl", md: "2xl" }} color="#154A99" mb={4}>
                                Our Programmes
                            </Heading>
                            <Text color="#000000" maxW="2xl" mx={{ base: "auto", md: "0" }}>
                                These catalogue of courses have been carefully curated to empower learners with 21st century education.
                            </Text>
                        </Box>

                        <Box position="relative" maxW={{ base: "full", md: "xs" }} w="100%">
                            <Input placeholder="Find your Course" borderRadius="none" bg="white" borderColor="#000000" pr={10} />
                            <Box position="absolute" right={3} top="50%" transform="translateY(-50%)" pointerEvents="none">
                                <Search size={18} color="#000000" />
                            </Box>
                        </Box>
                    </Flex>

                    <Box overflowX="auto" pb={2} css={{ '&::-webkit-scrollbar': { display: 'none' } }}>
                        <HStack gap={4} minW="max-content">
                            <Button size="sm" variant="ghost" color="#000000" _hover={{ bg: "#EC9A29" }} onClick={handleComingSoon}>Bachelor</Button>
                            <Button size="sm" bg="#F6AD55" color="white" _hover={{ bg: "#EC9A29" }} onClick={handleComingSoon}>Masters</Button>
                            <Button size="sm" variant="ghost" color="#000000" _hover={{ bg: "#EC9A29" }} onClick={handleComingSoon}>Sandwich</Button>
                            <Button size="sm" variant="ghost" color="#000000" _hover={{ bg: "#EC9A29" }} onClick={handleComingSoon}>Post-Graduate</Button>
                        </HStack>
                    </Box>

                    <MotionBox
                        bg="#EC9A29"
                        p={{ base: 6, md: 12 }}
                        borderRadius="none"
                        position="relative"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                            {programmes.map((prog, idx) => (
                                <MotionBox
                                    key={idx}
                                    bg="white"
                                    p={6}
                                    borderRadius="8px"

                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="space-between"
                                    h="180px"
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Heading size="md" color="#154A99" mb={4}>{prog.title}</Heading>

                                    <Flex justify="space-between" align="center">
                                        <Box border="1px solid" borderColor="gray.300" borderRadius="9px" px={3} py={1}>
                                            <Text fontSize="xs" fontWeight="bold" color="#000000">{prog.courses} Courses</Text>
                                        </Box>
                                        <IconButton aria-label="View" variant="ghost" borderRadius="full" onClick={handleComingSoon}>
                                            <CircleChevronRight size={20} />
                                        </IconButton>
                                    </Flex>
                                </MotionBox>
                            ))}
                        </SimpleGrid>

                        <Flex justify="flex-end" mt={6} gap={2}>
                            <IconButton aria-label="Previous" size="sm" variant="outline" borderColor="whiteAlpha.400" color="white" onClick={handleComingSoon}>
                                <ChevronLeft size={24} />
                            </IconButton>
                            <IconButton aria-label="Next" size="sm" bg="#2AB0E8" color="white" _hover={{ bg: "blue.700" }} onClick={handleComingSoon}>
                                <ChevronRight size={24} />
                            </IconButton>
                        </Flex>
                    </MotionBox>
                </VStack>
            </Container>
        </Box>
    );
};

export default Programmes;
