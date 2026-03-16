import { Box, Container, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

const stats = [
    { value: "5,000+", label: "Research Publications", target: 5000, suffix: "+" },
    { value: "100+", label: "Academic Programs", target: 100, suffix: "+" },
    { value: "30,000", label: "Alumni Worldwide", target: 30000, suffix: "" },
    { value: "200+", label: "Active Research Projects", target: 200, suffix: "+" },
];

const Counter = ({ target, suffix }: { target: number; suffix: string }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString() + suffix);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            const controls = animate(count, target, { duration: 2, ease: "easeOut" });
            return controls.stop;
        }
    }, [isInView, count, target]);

    return <motion.span ref={ref}>{rounded}</motion.span>;
};

const MotionBox = motion(Box);

const Stats = () => {
    return (
        <Box bg="#F0F8FF" py={{ base: 10, md: 16 }}>
            <Container maxW="container.xl">
                <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={{ base: 4, md: 8 }}>
                    {stats.map((stat, index) => (
                        <MotionBox
                            key={index}
                            bg="white"
                            p={8}
                            borderRadius="none"
                            boxShadow="sm"
                            textAlign="center"
                            whileHover={{ y: -10, boxShadow: "lg" }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <VStack gap={2}>
                                <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="#154A99">
                                    <Counter target={stat.target} suffix={stat.suffix} />
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                    {stat.label}
                                </Text>
                            </VStack>
                        </MotionBox>
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
};

export default Stats;
