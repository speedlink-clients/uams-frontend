import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Flex, Grid, GridItem, Text, Heading, Button, IconButton, Input, Image, NativeSelect, 
  Table, Checkbox, Badge, 
  Stack, HStack, VStack, 
  useBreakpointValue
} from '@chakra-ui/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Search, Plus, ChevronLeft, Send, ChevronDown } from 'lucide-react';
import { getAssetPath } from '../utils/assetPath';

const TableCheckbox = () => (
  <Checkbox.Root colorPalette="blue" size="sm">
    <Checkbox.HiddenInput />
    <Checkbox.Control rounded="md">
      <Checkbox.Indicator />
    </Checkbox.Control>
  </Checkbox.Root>
);

const performanceData = [
  { name: 'Yr 1', value: 50 },
  { name: 'Yr 2', value: 25 },
  { name: 'Yr 3', value: 72 },
  { name: 'Yr 4', value: 80 },
  { name: 'Yr 5', value: 30 },
  { name: 'Yr 6', value: 70 },
];

import { 
  getRegistrations 
} from '../services/registrationService';
import { 
  RegisteredCourse 
} from '../services/types';
import { Loader2 } from 'lucide-react';

const CoursesTab = () => {
  const [courses, setCourses] = React.useState<RegisteredCourse[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getRegistrations();
        if (data && data.courses) {
          setCourses(data.courses);
        }
      } catch (error) {
        console.error('Failed to fetch courses', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <VStack gap={{ base: 6, lg: 8 }} w="full" animation="fade-in 0.5s">
      <Box 
        bg="white" 
        rounded={{ base: "24px", lg: "32px" }} 
        p={{ base: 6, lg: 8 }} 
        border="1px" 
        borderColor="gray.100" 
        shadow="sm"
        w="full"
      >
        <Heading 
          fontSize={{ base: "md", lg: "lg" }} 
          fontWeight="bold" 
          color="slate.800" 
          mb={{ base: 6, lg: 8 }}
        >
          Registered Courses
        </Heading>
        <Box overflowX="auto" mx={{ base: -6, lg: 0 }} px={{ base: 6, lg: 0 }}>
          <Table.Root variant="outline">
            <Table.Header>
              <Table.Row borderBottom="1px" borderColor="gray.50">
                <Table.ColumnHeader px={4} py={3} w="8">
                  <TableCheckbox />
                </Table.ColumnHeader>
                <Table.ColumnHeader px={4} py={3} color="gray.400" fontSize="10px" textTransform="uppercase">Code</Table.ColumnHeader>
                <Table.ColumnHeader px={4} py={3} color="gray.400" fontSize="10px" textTransform="uppercase">Course Title</Table.ColumnHeader>
                <Table.ColumnHeader px={4} py={3} color="gray.400" fontSize="10px" textTransform="uppercase">Type</Table.ColumnHeader>
                <Table.ColumnHeader px={4} py={3} color="gray.400" fontSize="10px" textTransform="uppercase">Unit</Table.ColumnHeader>
                <Table.ColumnHeader px={4} py={3} color="gray.400" fontSize="10px" textTransform="uppercase">Lecturer(s)</Table.ColumnHeader>
                <Table.ColumnHeader px={4} py={3} color="gray.400" fontSize="10px" textTransform="uppercase">Status</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={7} px={4} py={8} textAlign="center">
                    <Flex justify="center" align="center" gap={2}>
                      <Loader2 className="animate-spin text-blue-500" size={20} />
                      <Text color="gray.500" fontSize="sm">Loading courses...</Text>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ) : courses.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={7} px={4} py={8} textAlign="center" color="gray.500" fontSize="sm">
                    No registered courses found.
                  </Table.Cell>
                </Table.Row>
              ) : (
                courses.map((course) => (
                  <Table.Row key={course.id} _hover={{ bg: 'slate.50' }} transition="background 0.2s" borderBottom="1px" borderColor="gray.50">
                    <Table.Cell px={4} py={4}>
                      <TableCheckbox />
                    </Table.Cell>
                    <Table.Cell px={4} py={4} fontWeight="bold" color="gray.500" fontSize="11px">{course.code}</Table.Cell>
                    <Table.Cell px={4} py={4} fontWeight="bold" color="slate.800" fontSize="11px">
                      {course.title}
                    </Table.Cell>
                    <Table.Cell px={4} py={4} color="gray.500" fontSize="11px">
                      {course.type || 'Departmental'}
                    </Table.Cell>
                    <Table.Cell px={4} py={4} color="gray.500" fontWeight="bold" fontSize="11px">
                      {course.creditUnits}
                    </Table.Cell>
                    <Table.Cell px={4} py={4} color="gray.500" fontSize="11px" fontWeight="medium">
                      {course.lecturer || 'Not Assigned'}
                    </Table.Cell>
                    <Table.Cell px={4} py={4}>
                      <Badge 
                        px={3} py={1} 
                        bg={course.status === 'registered' ? "green.50" : course.status === 'pending' ? "yellow.50" : "red.50"}
                        color={course.status === 'registered' ? "green.500" : course.status === 'pending' ? "yellow.600" : "red.500"}
                        rounded="full" 
                        fontSize="9px" 
                        fontWeight="bold" 
                        textTransform="uppercase" 
                        letterSpacing="wider"
                      >
                        {course.status}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>
    </VStack>
  );
};

const ResultsTab = () => {
  return (
    <VStack gap={{ base: 6, lg: 8 }} w="full" animation="fade-in 0.5s">
      <Box 
        bg="white" 
        rounded={{ base: "24px", lg: "32px" }} 
        p={{ base: 8, lg: 12 }} 
        border="1px" 
        borderColor="gray.100" 
        shadow="sm"
        w="full"
      >
        <Flex direction="column" align="center" justify="center" py={16} textAlign="center">
          <Box bg="purple.50" p={5} rounded="full" mb={6}>
            <Box color="purple.500" w={10} h={10}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
            </Box>
          </Box>
          <Heading fontSize={{ base: "lg", lg: "xl" }} fontWeight="bold" color="slate.800" mb={3}>
            Coming Soon
          </Heading>
          <Text fontSize="sm" color="gray.500" maxW="md">
            Results and academic performance tracking features are under development. Stay tuned!
          </Text>
        </Flex>
      </Box>
    </VStack>
  );
};

/* ====================================================================
   COMMENTED OUT ORIGINAL RESULTS TAB IMPLEMENTATION
   Uncomment and replace the above component when ready to implement
   ====================================================================

const ResultsTab = () => {
  const results = [
    { code: 'CSC201', title: 'Computer Science Introduction', unit: 3, ca: 20, exam: 55, total: 75, grade: 'A', remark: 'Distinction' },
    { code: 'CSC202', title: 'Data Structures', unit: 2, ca: 24, exam: 39, total: 63, grade: 'B', remark: 'Very Good' },
    { code: 'CSC203', title: 'Algorithms', unit: 3, ca: 7, exam: 50, total: 57, grade: 'C', remark: 'Credit' },
    { code: 'CSC204', title: 'Computer Architecture', unit: 1, ca: 21, exam: 25, total: 46, grade: 'D', remark: 'Pass' },
    { code: 'CSC205', title: 'Operating Systems', unit: 3, ca: 10, exam: 30, total: 40, grade: 'F', remark: 'Fail' },
    { code: 'CSC206', title: 'Database Management Systems', unit: 3, ca: 18, exam: 42, total: 60, grade: 'B', remark: 'Very Good' },
    { code: 'CSC207', title: 'Software Engineering', unit: 2, ca: 22, exam: 41, total: 63, grade: 'B', remark: 'Very Good' },
    { code: 'CSC208', title: 'Computer Networks', unit: 3, ca: 15, exam: 48, total: 63, grade: 'B', remark: 'Very Good' },
  ];

  const getRemarkStyle = (remark: string) => {
    switch (remark) {
      case 'Distinction': return { bg: 'green.50', color: 'green.600' };
      case 'Very Good': return { bg: 'teal.50', color: 'teal.600' };
      case 'Credit': return { bg: 'blue.50', color: 'blue.600' };
      case 'Pass': return { bg: 'yellow.50', color: 'yellow.700' };
      case 'Fail': return { bg: 'red.50', color: 'red.600' };
      default: return { bg: 'gray.100', color: 'gray.500' };
    }
  };

  return (
    <VStack gap={{ base: 6, lg: 8 }} w="full" animation="fade-in 0.5s">
      ... original content ...
    </VStack>
  );
};
*/

const ApplicationDetail = ({ onBack }: { onBack: () => void }) => (
  <Box 
    bg="white" 
    rounded={{ base: "24px", lg: "32px" }} 
    border="1px" 
    borderColor="gray.100" 
    shadow="sm" 
    overflow="hidden" 
    display="flex" 
    flexDirection="column" 
    h={{ base: "70vh", lg: "750px" }} 
    animation="slide-in-from-right 0.3s"
  >
    <Flex 
      px={{ base: 6, lg: 8 }} 
      py={{ base: 5, lg: 6 }} 
      borderBottom="1px" 
      borderColor="gray.50" 
      align="center" 
      justify="space-between" 
      flexShrink={0}
    >
      <Flex align="center" gap={{ base: 3, lg: 4 }}>
        <IconButton 
          aria-label="Back"  
          onClick={onBack} 
          variant="ghost" 
          rounded="full" 
          color="gray.400" 
          _hover={{ bg: "slate.50" }}
        >
          <ChevronLeft size={20} />
        </IconButton>
        <Heading 
          fontSize={{ base: "14px", lg: "15px" }} 
          fontWeight="bold" 
          color="slate.800" 
          maxW={{ base: "150px", lg: "none" }}
        >
          Complaint - CPT011
        </Heading>
      </Flex>
      <HStack gap={{ base: 2, lg: 3 }}>
        <Text display={{ base: "none", sm: "inline" }} fontSize="11px" fontWeight="bold" color="gray.400">Status</Text>
        <Badge 
          px={3} py={1} 
          bg="blue.50" 
          color="blue.500" 
          rounded="full" 
          fontSize="9px" 
          fontWeight="bold" 
          textTransform="uppercase" 
          letterSpacing="wider"
        >
          Active
        </Badge>
      </HStack>
    </Flex>
    
    <VStack 
      flex="1" 
      overflowY="auto" 
      p={{ base: 4, lg: 8 }} 
      gap={{ base: 6, lg: 8 }} 
      bg="white" 
      align="stretch"
      css={{
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: '24px' },
      }}
    >
      <Flex direction="column" maxW={{ base: "90%", sm: "85%" }}>
        <Box 
          bg="blue.50" 
          p={{ base: 4, lg: 6 }} 
          rounded={{ base: "20px", lg: "24px" }} 
          border="1px" 
          borderColor="blue.100"
        >
          <Text fontSize={{ base: "12px", lg: "13px" }} color="slate.800" lineHeight="relaxed" fontWeight="medium">
            I hope this message finds you well. I am writing to kindly notify you that my result for MTH 110.1 is currently missing...
          </Text>
        </Box>
        <Text fontSize="10px" fontWeight="bold" color="gray.300" mt={2} px={1}>9:00 am</Text>
      </Flex>

      <Flex direction="column" maxW={{ base: "90%", sm: "85%" }} alignSelf="flex-start">
        <Box 
          bg="white" 
          p={{ base: 4, lg: 6 }} 
          rounded={{ base: "20px", lg: "24px" }} 
          border="1px" 
          borderColor="gray.100" 
          shadow="sm"
        >
          <Text fontSize={{ base: "12px", lg: "13px" }} color="slate.800" lineHeight="relaxed" fontWeight="medium">
            Thank you for bringing this to my attention. Kindly confirm your full name and matric number...
          </Text>
        </Box>
        <Text fontSize="10px" fontWeight="bold" color="gray.300" mt={2} px={1} textAlign="right">10:00 am</Text>
      </Flex>
    </VStack>

    <Box p={{ base: 4, lg: 8 }} bg="white" borderTop="1px" borderColor="gray.50" flexShrink={0}>
      <Box position="relative">
        <Input 
          placeholder="Type text here to follow up on complaint" 
          bg="slate.50" 
          borderColor="gray.200" 
          rounded="2xl" 
          py={{ base: 4, lg: 5 }} 
          pl={{ base: 5, lg: 8 }} 
          pr={{ base: 12, lg: 14 }} 
          fontSize={{ base: "13px", lg: "sm" }} 
          fontWeight="medium" 
          color="slate.800" 
          _focus={{ outline: "none", borderColor: "blue.300" }}
          h="auto"
        />
        <Box position="absolute" right={4} top="50%" transform="translateY(-50%)" display="flex" alignItems="center">
          <IconButton
            aria-label="Send"
            variant="ghost"
            bg="blue.500"
            color="white"
            _hover={{ bg: "blue.600" }}
            size="sm"
            p={2}
            mr={2}
          >
            <Send size={16} />
          </IconButton>
          <Image src={getAssetPath('assets/Paperclip.png')} alt="Attach" boxSize="18px" cursor="pointer" />
        </Box>
      </Box>
    </Box>
  </Box>
);

const ApplicationsListView = ({ onLogNew, onSelect }: { onLogNew: () => void, onSelect: (id: string) => void }) => {
  return (
    <VStack gap={{ base: 6, lg: 8 }} w="full" animation="fade-in 0.5s">
      <Box 
        bg="white" 
        rounded={{ base: "24px", lg: "32px" }} 
        p={{ base: 8, lg: 12 }} 
        border="1px" 
        borderColor="gray.100" 
        shadow="sm"
        w="full"
      >
        <Flex direction="column" align="center" justify="center" py={16} textAlign="center">
          <Box bg="orange.50" p={5} rounded="full" mb={6}>
            <Box color="orange.500" w={10} h={10}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
              </svg>
            </Box>
          </Box>
          <Heading fontSize={{ base: "lg", lg: "xl" }} fontWeight="bold" color="slate.800" mb={3}>
            Coming Soon
          </Heading>
          <Text fontSize="sm" color="gray.500" maxW="md">
            Application and complaint logging features are under development. Stay tuned!
          </Text>
        </Flex>
      </Box>
    </VStack>
  );
};

/* ====================================================================
   COMMENTED OUT ORIGINAL APPLICATIONS LIST VIEW IMPLEMENTATION
   Uncomment and replace the above component when ready to implement
   ====================================================================

const ApplicationsListView = ({ onLogNew, onSelect }: { onLogNew: () => void, onSelect: (id: string) => void }) => {
  const applications = [
    { id: '1', code: 'CPT011', subject: 'Missing Result Complaint', desc: 'My result for MTH110.1 is missing and i wrote...', update: '30m ago', status: 'In Progress', color: 'blue' },
    { id: '2', code: 'CPT011', subject: 'Result Remark Request', desc: 'I believe my result for MTH110.1 is not my score...', update: '3d ago', status: 'In Progress', color: 'blue' },
    { id: '3', code: 'CPT011', subject: 'Missing Result Complaint', desc: 'My result for MTH110.1 is missing and i wrote...', update: '7d ago', status: 'Pending Review', color: 'pink' },
    { id: '4', code: 'CPT011', subject: 'Missing Result Complaint', desc: 'My result for MTH110.1 is missing and i wrote...', update: '1w ago', status: 'Completed', color: 'green' },
    { id: '5', code: 'CPT011', subject: 'Missing Result Complaint', desc: 'My result for MTH110.1 is missing and i wrote...', update: '2mon ago', status: 'Completed', color: 'green' },
    { id: '6', code: 'CPT011', subject: 'Missing Result Complaint', desc: 'My result for MTH110.1 is missing and i wrote...', update: '1yr ago', status: 'Pending Review', color: 'pink' },
    { id: '7', code: 'CPT011', subject: 'Missing Result Complaint', desc: 'My result for MTH110.1 is missing and i wrote...', update: '1yr ago', status: 'Completed', color: 'green' },
  ];

  return (
    <VStack gap={{ base: 6, lg: 8 }} w="full" animation="fade-in 0.5s">
      ... original content ...
    </VStack>
  );
};
*/

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeSubTab = (() => {
    if (location.pathname.includes('/courses/courses')) return 'courses';
    if (location.pathname.includes('/courses/applications')) return 'applications';
    return 'results';
  })();

  return (
    <Box p={{ base: 4, lg: 8 }} maxW="1600px" mx="auto">
      <VStack gap={{ base: 6, lg: 8 }} w="full">
        {/* Sub-Tabs Navigation */}
        <Flex justify="center" overflowX="auto" mx={-4} px={4} py={2} w="full">
          <HStack 
            bg="white" 
            p={1} 
            rounded="20px" 
            border="1px" 
            borderColor="gray.100" 
            shadow="sm" 
            gap={0}
          >
            {(['courses', 'results', 'applications'] as const).map((tab) => (
              <Button
                key={tab}
                onClick={() => navigate(`/courses/${tab}`)}
                variant="ghost"
                px={{ base: 6, sm: 12 }}
                py={6}
                rounded="2xl"
                fontSize={{ base: "12px", lg: "sm" }}
                fontWeight="bold"
                bg={activeSubTab === tab ? 'blue.500' : 'transparent'}
                color={activeSubTab === tab ? 'white' : 'gray.400'}
                _hover={{ 
                  bg: activeSubTab === tab ? 'blue.600' : 'gray.50',
                  color: activeSubTab === tab ? 'white' : 'gray.600'
                }}
                shadow={activeSubTab === tab ? 'md' : 'none'}
                transition="all 0.3s"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </HStack>
        </Flex>

        {/* Conditional Rendering based on Sub-Tab and View State */}
        <Box minH="600px" w="full">
          <Routes>
            <Route path="courses" element={<CoursesTab />} />
            <Route path="results" element={<ResultsTab />} />
            <Route path="applications" element={<ApplicationsListView onLogNew={() => navigate('applications/new')} onSelect={(id: string) => navigate(`applications/${id}`)} />} />
            <Route path="applications/new" element={<ApplicationDetail onBack={() => navigate('/courses/applications')} />} />
            <Route path="applications/:id" element={<ApplicationDetail onBack={() => navigate('/courses/applications')} />} />
            <Route path="*" element={<ResultsTab />} />
          </Routes>
        </Box>
      </VStack>
    </Box>
  );
};

export default Courses;