import { Box, Container, Heading, SimpleGrid, Image, Button, Flex, IconButton } from "@chakra-ui/react";
import { toaster } from "@components/ui/toaster";
import { CircleChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const RES_IMG_1 = "/images/908a79ed56fe1527040c774b8c7df624e03c2bd6.jpg";
const RES_IMG_2 = "/images/75f5deb86290b0ecd1e23ae5ba7b028477264719.jpg";
const RES_IMG_3 = "/images/eee418acf0a641e88faad2a1327bcb950478f4ee.png";

const MotionBox = motion(Box);

const resources = [
    { title: "Department Handbook", image: RES_IMG_1 },
    { title: "E-books", image: RES_IMG_2 },
    { title: "E-courses", image: RES_IMG_3 },
];

const ResourcesSection = () => {
    const handleComingSoon = () => {
        toaster.create({
            title: "Coming Soon",
            description: "Resource materials will be accessible soon.",
            type: "info",
        });
    };
    return (
        <Box id="resources" py={20} bg="white">
            <Container maxW="container.xl">
                <Heading as="h3" size="3xl" color="#003366" textAlign="center" mb={12}>
                    Access Our Resources
                </Heading>

                <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
                    {resources.map((res, idx) => (
                        <MotionBox
                            key={idx}
                            border="2px solid"
                            borderColor="#2AB0E8"
                            borderRadius="8px"
                            p={6}
                            whileHover={{ y: -10, boxShadow: "xl" }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Box bg="transparent" mb={6} borderRadius="sm" overflow="hidden" display="flex" justifyContent="center" alignItems="center" h="170px">
                                <Image src={res.image} alt={res.title} maxH="170px" objectFit="contain" />
                            </Box>

                            <Heading size="md" color="#003366" mb={6}>
                                {res.title}
                            </Heading>

                            <Flex justify="space-between" align="center">
                                <Button variant="outline" borderColor="gray.300" borderRadius="200px" size="sm" color="gray.600" fontSize="xs" _hover={{ bg: "#2AB0E8", color: "white" }} onClick={handleComingSoon}>
                                    See More
                                </Button>
                                <IconButton aria-label="Go" variant="ghost" borderRadius="full" size="sm" color="#000000" onClick={handleComingSoon}>
                                    <CircleChevronRight size={30} />
                                </IconButton>
                            </Flex>
                        </MotionBox>
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
};

export default ResourcesSection;
