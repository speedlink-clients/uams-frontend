import {
  Box,
  Container,
  Flex,
  Text,
  Heading,
  Button,
  SimpleGrid,
  Image,
  Input,
  VStack,
  HStack,
  Link,
  Icon,
} from "@chakra-ui/react";
import {
  Search,
  CheckCircle,
  ChevronRight,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronLeft,
} from "lucide-react";

const App = () => {
  return (
    <Box minH="100vh" bg="white">
      {/* 1. Top Navigation Bar */}
      <Box w="full">
        {/* Top Strip */}
        <Box bg="blue.600" py={2}>
          <Text color="white" textAlign="center" fontSize="sm" fontWeight="medium">
            Admission for the January 2026 academic session is ongoing.{" "}
            <Link fontWeight="bold" textDecoration="underline">
              Apply Now!
            </Link>
          </Text>
        </Box>

        {/* Main Navbar */}
        <Container maxW="container.xl" py={4}>
          <Flex justify="space-between" align="center">
            {/* Left: Logo */}
            <HStack gap={3}>
              <Box bg="blue.500" p={2} borderRadius="md">
                {/* SVG Logo Placeholder */}
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4L4 10V22L16 28L28 22V10L16 4Z" stroke="white" strokeWidth="2" />
                  <path d="M16 12V24" stroke="white" strokeWidth="2" />
                  <path d="M10 16H22" stroke="white" strokeWidth="2" />
                </svg>
              </Box>
              <VStack align="start" gap={0}>
                <Text fontWeight="extrabold" fontSize="xl" color="brand.900" lineHeight="1">
                  UNIPORT
                </Text>
                <Text fontSize="xs" color="gray.600" fontWeight="medium">
                  UNIVERSITY OF PORT HARCOURT
                </Text>
              </VStack>
            </HStack>

            {/* Center: Navigation Links */}
            <HStack gap={8} display={{ base: "none", md: "flex" }}>
              {["Home", "About", "Research", "Collaborations", "Admissions", "Updates"].map((item) => (
                <Link key={item} color="gray.700" fontWeight="semibold" fontSize="sm" _hover={{ color: "blue.500" }}>
                  {item}
                </Link>
              ))}
            </HStack>

            {/* Right: Search & Button */}
            <HStack gap={6}>
              <Icon as={Search} boxSize={5} color="gray.600" cursor="pointer" />
              <Button bg="cyan.400" color="white" px={8} borderRadius="md" _hover={{ bg: "cyan.500" }}>
                Training Courses
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* 2. Hero Section */}
      <Box position="relative">
        <Box
          h={{ base: "500px", md: "600px" }}
          w="full"
          bgImage="url('https://images.unsplash.com/photo-1541339907198-e08756ebafe3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')"
          bgSize="cover"
          backgroundPosition="center"
          position="relative"
        >
          {/* Dark Overlay */}
          <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="blackAlpha.600" />

          {/* Hero Content */}
          <Container maxW="container.xl" h="full" position="relative" zIndex={1}>
            <VStack justify="center" h="full" gap={6} maxW="800px" mx="auto" textAlign="center">
              <VStack gap={0}>
                <Box bg="white" color="brand.900" px={6} py={2} mb={1}>
                  <Heading as="h1" fontSize={{ base: "3xl", md: "5xl" }} fontWeight="black">
                    Building the Next Generation
                  </Heading>
                </Box>
                <Box bg="white" px={6} py={2}>
                  <Heading as="h1" fontSize={{ base: "3xl", md: "5xl" }} fontWeight="black" color="blue.500">
                    of Technology Experts
                  </Heading>
                </Box>
              </VStack>
              <Text color="white" fontSize="lg" fontWeight="medium" maxW="600px">
                Join a world-class academic community dedicated to innovation, research excellence, and technological
                advancement in the heart of the Niger Delta.
              </Text>

              {/* Carousel Indicators */}
              <HStack mt={10}>
                <Box w={3} h={3} borderRadius="full" bg="white" />
                <Box w={3} h={3} borderRadius="full" bg="whiteAlpha.400" />
                <Box w={3} h={3} borderRadius="full" bg="whiteAlpha.400" />
              </HStack>
            </VStack>
          </Container>
        </Box>

        {/* 2.1 Floating Stats Cards */}
        <Container maxW="container.xl" mt="-60px" position="relative" zIndex={2}>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={6}>
            {[
              { val: "5,000+", label: "Research Publications" },
              { val: "100+", label: "Academic Programs" },
              { val: "30,000", label: "Alumni Worldwide" },
              { val: "200+", label: "Active Research Projects" },
            ].map((stat, i) => (
              <Box key={i} bg="white" p={8} borderRadius="lg" boxShadow="xl" textAlign="center">
                <Text color="blue.500" fontSize="3xl" fontWeight="black" mb={2}>
                  {stat.val}
                </Text>
                <Text color="gray.600" fontSize="xs" fontWeight="bold" textTransform="uppercase">
                  {stat.label}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* 3. About Us Section */}
      <Box py={24}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={20} alignSelf="center">
            {/* Left: Image */}
            <Box borderRadius="2xl" overflow="hidden" boxShadow="2xl">
              <Image
                src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="University Building"
                w="full"
                h="full"
                objectFit="cover"
              />
            </Box>

            {/* Right: Content */}
            <VStack align="start" gap={6} justify="center">
              <Text color="blue.500" fontWeight="bold" fontSize="sm" letterSpacing="widest">
                ABOUT US
              </Text>
              <Heading as="h2" fontSize="4xl" fontWeight="black" color="brand.900">
                Uniport At A Glance
              </Heading>
              <Text color="gray.600" fontSize="lg" lineHeight="tall">
                Established in 1975, the University of Port Harcourt (UNIPORT) is a leading institution in the Niger
                Delta, committed to academic excellence, research, and innovation. We provide a stimulating environment
                for learning and discovery.
              </Text>
              <Text color="gray.600" fontSize="lg" lineHeight="tall">
                Through our core mandate of teaching, research, and community service, we are shaping the future of
                higher education in Nigeria and beyond, with a focus on technology and sustainable development.
              </Text>
              <Button bg="cyan.400" color="white" px={10} py={6} borderRadius="md" _hover={{ bg: "cyan.500" }}>
                Read More
              </Button>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* 4. CTA Section ("Secure Your Future") */}
      <Box bg="brand.700" py={20} color="white">
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={16} alignSelf="center">
            {/* Left Content */}
            <VStack align="start" gap={8} justify="center">
              <Heading as="h2" fontSize="4xl" fontWeight="black" maxW="400px">
                Secure Your Future in Tech Now!!!
              </Heading>
              <SimpleGrid columns={1} gap={4}>
                {[
                  "Up to 100% Discount",
                  "Tutor-Led Training",
                  "6-12 Months Access",
                  "Global Certifications",
                ].map((item) => (
                  <HStack key={item} gap={4}>
                    <Icon as={CheckCircle} color="cyan.400" boxSize={6} />
                    <Text fontSize="lg" fontWeight="medium">
                      {item}
                    </Text>
                  </HStack>
                ))}
              </SimpleGrid>
              <Button bg="cyan.400" color="white" w="full" py={7} borderRadius="md" _hover={{ bg: "cyan.500" }} fontSize="lg">
                Get Started Now
              </Button>
            </VStack>

            {/* Right Image Container */}
            <Box position="relative">
              <Box
                bg="white"
                p={4}
                borderRadius="3xl"
                transform={{ base: "none", md: "rotate(3deg)" }}
                boxShadow="2xl"
              >
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80"
                  alt="Student working"
                  borderRadius="2xl"
                  w="full"
                  h="400px"
                  objectFit="cover"
                />
              </Box>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* 5. Programmes Section */}
      <Box py={24}>
        <Container maxW="container.xl">
          <VStack align="start" mb={12} gap={2}>
            <Text color="blue.500" fontWeight="bold" fontSize="sm" letterSpacing="widest">
              FACULTY
            </Text>
            <Heading as="h2" fontSize="4xl" fontWeight="black" color="brand.900">
              Our Programmes
            </Heading>
          </VStack>

          {/* Controls */}
          <Flex justify="space-between" direction={{ base: "column", md: "row" }} gap={6} mb={10}>
            <HStack gap={4} wrap="wrap">
              {["Bachelor", "Masters", "PHD", "Sandwich"].map((item) => (
                <Button
                  key={item}
                  bg={item === "Masters" ? "orange.400" : "gray.100"}
                  color={item === "Masters" ? "white" : "gray.600"}
                  px={8}
                  borderRadius="full"
                  _hover={{ bg: item === "Masters" ? "orange.500" : "gray.200" }}
                  fontWeight="bold"
                >
                  {item}
                </Button>
              ))}
            </HStack>
            <Box position="relative" w={{ base: "full", md: "300px" }}>
              <Input placeholder="Search programmes..." borderRadius="full" bg="gray.100" border="none" pl={12} />
              <Icon as={Search} position="absolute" left={4} top="50%" transform="translateY(-50%)" color="gray.400" />
            </Box>
          </Flex>

          {/* Carousel Area */}
          <Box bg="orange.400" p={12} borderRadius="3xl" position="relative">
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
              {[
                { title: "MSc in Computer Science", courses: "15 Courses" },
                { title: "MSc in Engineering", courses: "12 Courses" },
                { title: "MSc in Cybersecurity", courses: "10 Courses" },
              ].map((prog, i) => (
                <Box key={i} bg="white" p={8} borderRadius="2xl" boxShadow="lg">
                  <VStack align="start" gap={6}>
                    <Heading as="h3" fontSize="2xl" fontWeight="black" color="brand.900" minH="60px">
                      {prog.title}
                    </Heading>
                    <HStack justify="space-between" w="full">
                      <Box bg="gray.100" px={4} py={1} borderRadius="full">
                        <Text fontSize="xs" fontWeight="bold" color="gray.600">
                          {prog.courses}
                        </Text>
                      </Box>
                      <Box bg="brand.700" p={2} borderRadius="full" color="white">
                        <Icon as={ArrowRight} boxSize={4} />
                      </Box>
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>

            {/* Navigation Arrows */}
            <HStack position="absolute" bottom={4} right={12} gap={4}>
              <Button bg="whiteAlpha.300" color="white" p={0} minW="10" h="10" borderRadius="md" _hover={{ bg: "whiteAlpha.400" }}>
                <Icon as={ChevronLeft} />
              </Button>
              <Button bg="brand.700" color="white" p={0} minW="10" h="10" borderRadius="md" _hover={{ bg: "brand.900" }}>
                <Icon as={ChevronRight} />
              </Button>
            </HStack>
          </Box>
        </Container>
      </Box>

      {/* 6. News & Features Section */}
      <Box py={24}>
        <Container maxW="container.xl">
          <Heading as="h2" fontSize="4xl" fontWeight="black" color="brand.900" mb={12} textAlign="center">
            Latest News and Features
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={8} mb={16}>
            {[
              {
                title: "University of Port Harcourt set to model other Top Nigerian Schools",
                date: "January 20, 2026",
                text: "The university is embarking on a massive digital transformation project to enhance learning and administrative efficiency.",
                image: "https://images.unsplash.com/photo-1523240715181-01489b9ed4ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
              },
              {
                title: "Uniport Wins EU Grant to Monitor Effects of Climate Change",
                date: "January 15, 2026",
                text: "A team of researchers from the Department of Environmental Science has secured a multi-million euro grant.",
                image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
              },
              {
                title: "Peter Obi's graduate Receive The Science Award (ESN)",
                date: "January 10, 2026",
                text: "The Engineering Students Network has recognized our outstanding graduates for their innovative projects in renewable energy.",
                image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
              },
            ].map((news, i) => (
              <Box key={i} borderRadius="2xl" overflow="hidden" boxShadow="sm" border="1px" borderColor="gray.100" _hover={{ boxShadow: "md" }} transition="all 0.3s">
                <Image src={news.image} alt={news.title} h="240px" w="full" objectFit="cover" />
                <VStack p={8} align="start" gap={4}>
                  <Text color="gray.400" fontSize="xs" fontWeight="bold">{news.date}</Text>
                  <Heading as="h4" fontSize="lg" fontWeight="black" color="blue.600" lineHeight="short">
                    {news.title}
                  </Heading>
                  <Text color="gray.600" fontSize="sm" lineClamp={3}>
                    {news.text}
                  </Text>
                  <Button bg="brand.700" color="white" size="sm" px={6} _hover={{ bg: "brand.900" }}>
                    Read More
                  </Button>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
          <Flex justify="center">
            <Button bg="cyan.400" color="white" px={10} py={6} _hover={{ bg: "cyan.500" }}>
              Read More News
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* 7. Library Section */}
      <Box bg="brand.900" color="white">
        <SimpleGrid columns={{ base: 1, md: 2 }}>
          <Box p={{ base: 10, md: 24 }}>
            <VStack align="start" gap={8}>
              <Text color="cyan.400" fontWeight="bold" fontSize="sm" letterSpacing="widest">
                LIBRARY
              </Text>
              <Heading as="h2" fontSize="4xl" fontWeight="black">
                Explore One of Nigeria's Premier Academic Libraries
              </Heading>
              <Text color="gray.300" fontSize="lg">
                Our library offers a vast collection of digital and physical resources, providing a conducive environment for research and study.
              </Text>
              <VStack align="start" gap={4}>
                {[
                  "Access to over 1 million digital journals",
                  "24/7 online resource portal",
                  "Collaborative study spaces with high-speed internet",
                ].map((item) => (
                  <HStack key={item} gap={4}>
                    <Box w={2} h={2} borderRadius="full" bg="orange.400" />
                    <Text fontSize="md" fontWeight="medium">{item}</Text>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          </Box>
          <Box position="relative">
            <Image
              src="https://images.unsplash.com/photo-1507738911748-d6683935ddc5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Library Interior"
              w="full"
              h="full"
              objectFit="cover"
            />
          </Box>
        </SimpleGrid>
      </Box>

      {/* 8. Resources Section */}
      <Box py={24} bg="gray.50">
        <Container maxW="container.xl">
          <Heading as="h2" fontSize="3xl" fontWeight="black" color="brand.900" mb={16} textAlign="center">
            Access Our Resources
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
            {[
              { title: "Department Handbook", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80" },
              { title: "E-books", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
              { title: "E-courses", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
            ].map((res, i) => (
              <Box key={i} bg="white" p={0} borderRadius="2xl" overflow="hidden" boxShadow="sm" border="1px" borderColor="blue.100">
                <Image src={res.image} alt={res.title} h="200px" w="full" objectFit="cover" />
                <VStack p={8} align="center" gap={6}>
                  <Heading as="h4" fontSize="xl" fontWeight="black" color="blue.600">
                    {res.title}
                  </Heading>
                  <Button variant="outline" color="blue.500" borderColor="blue.500" w="full" py={6} gap={2} _hover={{ bg: "blue.50" }}>
                    See More <Icon as={ChevronRight} boxSize={4} />
                  </Button>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* 9. Newsletter Section */}
      <Box bg="blue.50" py={12}>
        <Container maxW="container.xl">
          <Flex direction={{ base: "column", lg: "row" }} justify="space-between" align="center" gap={12}>
            <VStack align={{ base: "center", lg: "start" }} gap={2}>
              <Heading as="h2" fontSize="3xl" fontWeight="black" color="brand.900">
                Join Our Newsletter
              </Heading>
              <Text color="gray.600">Stay updated with the latest news and academic trends.</Text>
            </VStack>
            <HStack w={{ base: "full", lg: "500px" }} gap={0}>
              <Input
                placeholder="Your Email Address"
                bg="white"
                h="60px"
                borderRadius="md 0 0 md"
                border="none"
                _focus={{ boxShadow: "none" }}
              />
              <Button bg="orange.400" color="white" h="60px" px={8} borderRadius="0 md md 0" _hover={{ bg: "orange.500" }} fontWeight="bold">
                SUBSCRIBE
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* 10. Footer */}
      <Box bg="brand.900" color="gray.400" py={20}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={12} mb={20}>
            {/* Col 1 */}
            <VStack align="start" gap={6}>
              <HStack gap={3}>
                <Box bg="white" p={2} borderRadius="md">
                  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 4L4 10V22L16 28L28 22V10L16 4Z" stroke="#1A365D" strokeWidth="2" />
                  </svg>
                </Box>
                <Heading as="h4" fontSize="xl" color="white" fontWeight="black">UNIPORT</Heading>
              </HStack>
              <Text fontSize="sm">
                East-West Road, Choba, Port Harcourt, Rivers State, Nigeria.
              </Text>
              <VStack align="start" gap={2}>
                <Text fontSize="sm">Hotline: +234 800 123 4567</Text>
                <Text fontSize="sm">Email: info@uniport.edu.ng</Text>
              </VStack>
            </VStack>

            {/* Col 2 */}
            <VStack align="start" gap={6}>
              <Heading as="h4" fontSize="md" color="white" fontWeight="bold">Quick Links</Heading>
              <VStack align="start" gap={3}>
                {["Admissions", "Recent News", "Academic Calendar", "Student Portal", "Staff Mail"].map((link) => (
                  <Link key={link} fontSize="sm" _hover={{ color: "white" }}>{link}</Link>
                ))}
              </VStack>
            </VStack>

            {/* Col 3 */}
            <VStack align="start" gap={6}>
              <Heading as="h4" fontSize="md" color="white" fontWeight="bold">Navigation</Heading>
              <VStack align="start" gap={3}>
                {["Home", "About", "Research", "Collaborations", "Faculties", "Updates"].map((link) => (
                  <Link key={link} fontSize="sm" _hover={{ color: "white" }}>{link}</Link>
                ))}
              </VStack>
            </VStack>

            {/* Social Icons */}
            <VStack align="start" gap={6}>
              <Heading as="h4" fontSize="md" color="white" fontWeight="bold">Follow Us</Heading>
              <HStack gap={4}>
                {[Facebook, Twitter, Instagram, Linkedin].map((IconComp, i) => (
                  <Box key={i} bg="brand.800" p={3} borderRadius="full" color="white" cursor="pointer" _hover={{ bg: "blue.500" }}>
                    <Icon as={IconComp} boxSize={5} />
                  </Box>
                ))}
              </HStack>
            </VStack>
          </SimpleGrid>

          <Box borderTop="1px" borderColor="brand.800" pt={8} textAlign="center">
            <Text fontSize="xs">
              Copyright © 2026 Department of Computer Science, University of Port Harcourt. All rights reserved.
            </Text>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default App;