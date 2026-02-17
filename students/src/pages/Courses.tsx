import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Flex, Grid, GridItem, Text, Heading, Button, IconButton, Input, Image, NativeSelect, 
  Table, Checkbox, Badge, 
  Stack, HStack, VStack, 
  useBreakpointValue, Textarea
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

const ComplaintsListView = ({ onLogNew, onSelect }: { onLogNew: () => void, onSelect: (id: string) => void }) => {
  const complaints = [
    { id: '1', code: 'CPT011', subject: 'Missing Result Complaint', desc: 'My result for MTH110.1 is missing and i wrote...', update: '30m ago', status: 'In Progress', color: 'blue' },
    { id: '2', code: 'CPT011', subject: 'Result Remark Request', desc: 'I believe my result for MTH110.1 is not my score...', update: '3d ago', status: 'In Progress', color: 'blue' },
    { id: '3', code: 'CPT011', subject: 'Missing Result Complaint', desc: 'My result for MTH110.1 is missing and i wrote...', update: '7d ago', status: 'Pending Review', color: 'pink' },
    { id: '4', code: 'CPT011', subject: 'Missing Result Complaint', desc: 'My result for MTH110.1 is missing and i wrote...', update: '1w ago', status: 'Completed', color: 'green' },
    { id: '5', code: 'CPT011', subject: 'Missing Result Complaint', desc: 'My result for MTH110.1 is missing and i wrote...', update: '2mon ago', status: 'Completed', color: 'green' },
    { id: '6', code: 'CPT011', subject: 'Missing Result Complaint', desc: 'My result for MTH110.1 is missing and i wrote...', update: '1yr ago', status: 'Pending Review', color: 'pink' },
    { id: '7', code: 'CPT011', subject: 'Missing Result Complaint', desc: 'My result for MTH110.1 is missing and i wrote...', update: '1yr ago', status: 'Completed', color: 'green' },
  ];

  const getStatusStyle = (color: string) => {
    switch (color) {
      case 'blue': return { bg: 'blue.50', color: 'blue.500' };
      case 'pink': return { bg: 'orange.50', color: 'orange.500' };
      case 'green': return { bg: 'green.50', color: 'green.600' };
      default: return { bg: 'gray.100', color: 'gray.500' };
    }
  };

  return (
    <VStack gap={{ base: 6, lg: 8 }} w="full" animation="fade-in 0.5s">
      {/* Log New Complaints Button */}
      <Flex justify="flex-end" w="full">
        <Button
          onClick={onLogNew}
          bg="blue.500"
          color="white"
          rounded="xl"
          px={6}
          py={5}
          fontSize="13px"
          fontWeight="bold"
          _hover={{ bg: 'blue.600' }}
          shadow="md"
        >
          <Plus size={16} />
          Log New Complaints
        </Button>
      </Flex>

      {/* Complaints Table */}
      <Box
        bg="white"
        rounded={{ base: "24px", lg: "32px" }}
        p={{ base: 5, lg: 8 }}
        border="1px"
        borderColor="gray.100"
        shadow="sm"
        w="full"
      >
        {/* Header */}
        <Flex
          justify="space-between"
          align={{ base: "start", md: "center" }}
          mb={6}
          direction={{ base: "column", md: "row" }}
          gap={4}
        >
          <Heading fontSize={{ base: "md", lg: "lg" }} fontWeight="bold" color="slate.800">
            All Complaints
          </Heading>
          <HStack gap={3}>
            {/* Search */}
            <Box position="relative">
              <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.300" zIndex={1}>
                <Search size={14} />
              </Box>
              <Input
                placeholder="Search by subject, code, date"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.100"
                rounded="lg"
                pl={9}
                pr={4}
                py={2}
                fontSize="12px"
                fontWeight="medium"
                color="slate.700"
                _placeholder={{ color: 'gray.300' }}
                _focus={{ outline: 'none', borderColor: 'blue.300' }}
                w={{ base: "full", md: "220px" }}
                h="36px"
              />
            </Box>
            {/* Filter */}
            <Box position="relative">
              <select
                style={{
                  background: '#f8fafc',
                  border: '1px solid #f1f5f9',
                  borderRadius: '8px',
                  padding: '6px 28px 6px 12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#64748b',
                  appearance: 'none',
                  cursor: 'pointer',
                  height: '36px',
                }}
              >
                <option>All Complaints</option>
                <option>In Progress</option>
                <option>Pending Review</option>
                <option>Completed</option>
              </select>
              <Box position="absolute" right={2} top="50%" transform="translateY(-50%)" pointerEvents="none" color="gray.400">
                <ChevronDown size={14} />
              </Box>
            </Box>
          </HStack>
        </Flex>

        {/* Table */}
        <Box overflowX="auto">
          <Table.Root size="sm" variant="line">
            <Table.Header>
              <Table.Row borderBottom="1px solid" borderColor="gray.100">
                <Table.ColumnHeader w="40px" py={3}>
                  <TableCheckbox />
                </Table.ColumnHeader>
                <Table.ColumnHeader fontSize="11px" fontWeight="bold" color="gray.400" textTransform="capitalize" py={3}>Code</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="11px" fontWeight="bold" color="gray.400" textTransform="capitalize" py={3}>Subject</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="11px" fontWeight="bold" color="gray.400" textTransform="capitalize" py={3} display={{ base: "none", md: "table-cell" }}>Description</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="11px" fontWeight="bold" color="gray.400" textTransform="capitalize" py={3}>Last Update</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="11px" fontWeight="bold" color="gray.400" textTransform="capitalize" py={3} textAlign="center">Status</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {complaints.map((app) => {
                const statusStyle = getStatusStyle(app.color);
                return (
                  <Table.Row
                    key={app.id}
                    borderBottom="1px solid"
                    borderColor="gray.50"
                    _hover={{ bg: 'gray.25' }}
                    cursor="pointer"
                    onClick={() => onSelect(app.id)}
                  >
                    <Table.Cell py={4} onClick={(e) => e.stopPropagation()}>
                      <TableCheckbox />
                    </Table.Cell>
                    <Table.Cell py={4}>
                      <Text fontSize="12px" fontWeight="bold" color="slate.700">{app.code}</Text>
                    </Table.Cell>
                    <Table.Cell py={4}>
                      <Text fontSize="12px" fontWeight="medium" color="slate.700">{app.subject}</Text>
                    </Table.Cell>
                    <Table.Cell py={4} display={{ base: "none", md: "table-cell" }}>
                      <Text fontSize="12px" color="gray.400" fontWeight="medium" maxW="350px" truncate>{app.desc}</Text>
                    </Table.Cell>
                    <Table.Cell py={4}>
                      <Text fontSize="11px" fontWeight="medium" color="gray.400">{app.update}</Text>
                    </Table.Cell>
                    <Table.Cell py={4} textAlign="center">
                      <Badge
                        px={3} py={1}
                        bg={statusStyle.bg}
                        color={statusStyle.color}
                        rounded="full"
                        fontSize="9px"
                        fontWeight="bold"
                        textTransform="capitalize"
                      >
                        {app.status}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>
    </VStack>
  );
};

const MakeComplaintView = ({ onBack }: { onBack: () => void }) => (
  <Box
    bg="white"
    rounded={{ base: "24px", lg: "32px" }}
    p={{ base: 6, lg: 10 }}
    border="1px"
    borderColor="gray.100"
    shadow="sm"
    animation="fade-in 0.3s"
  >
    <Heading fontSize={{ base: "md", lg: "lg" }} fontWeight="bold" color="slate.800" mb={6}>
      Make Complaint
    </Heading>

    {/* Subject */}
    <Box mb={5}>
      <Text fontSize="13px" fontWeight="bold" color="slate.700" mb={2}>Subject</Text>
      <Input
        placeholder="Missing script"
        bg="gray.50"
        border="1px solid"
        borderColor="gray.200"
        rounded="lg"
        px={4}
        py={5}
        fontSize="13px"
        fontWeight="medium"
        color="slate.800"
        _placeholder={{ color: 'gray.300' }}
        _focus={{ outline: 'none', borderColor: 'blue.300' }}
        h="auto"
      />
    </Box>

    {/* Message */}
    <Box mb={8}>
      <Text fontSize="13px" fontWeight="bold" color="slate.700" mb={2}>Message</Text>
      <Textarea
        placeholder="Your message here..."
        bg="gray.50"
        border="1px solid"
        borderColor="gray.200"
        rounded="lg"
        px={4}
        py={4}
        fontSize="13px"
        fontWeight="medium"
        color="slate.800"
        w="full"
        minH="200px"
        resize="vertical"
        _placeholder={{ color: 'gray.300' }}
        _focus={{ outline: 'none', borderColor: 'blue.300' }}
        css={{
          '&::placeholder': { color: '#cbd5e1' },
          '&:focus': { outline: 'none', borderColor: '#93c5fd' },
        }}
      />
    </Box>

    {/* Actions */}
    <Flex justify="flex-end" gap={3}>
      <Button
        onClick={onBack}
        variant="ghost"
        border="1px solid"
        borderColor="gray.200"
        rounded="lg"
        px={4}
        py={3}
        fontSize="13px"
        fontWeight="bold"
        color="gray.500"
        bg="white"
        _hover={{ bg: 'gray.100' }}
        h="auto"
      >
        Cancel
      </Button>
      <Button
        bg="blue.500"
        color="white"
        rounded="lg"
        px={6}
        py={3}
        fontSize="13px"
        fontWeight="bold"
        _hover={{ bg: 'blue.600' }}
        shadow="sm"
        h="auto"
      >
        Submit
      </Button>
    </Flex>
  </Box>
);

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeSubTab = (() => {
    if (location.pathname.includes('/courses/courses')) return 'courses';
    if (location.pathname.includes('/courses/complaints')) return 'complaints';
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
            {(['courses', 'results', 'complaints'] as const).map((tab) => {
              const tabLabels: Record<string, string> = { courses: 'Courses', results: 'Results', complaints: 'Complaints' };
              return (
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
                {tabLabels[tab]}
              </Button>
              );
            })}
          </HStack>
        </Flex>

        {/* Conditional Rendering based on Sub-Tab and View State */}
        <Box minH="600px" w="full">
          <Routes>
            <Route path="courses" element={<CoursesTab />} />
            <Route path="results" element={<ResultsTab />} />
            <Route path="complaints" element={<ComplaintsListView onLogNew={() => navigate('complaints/new')} onSelect={(id: string) => navigate(`complaints/${id}`)} />} />
            <Route path="complaints/new" element={<MakeComplaintView onBack={() => navigate('/courses/complaints')} />} />
            <Route path="*" element={<ResultsTab />} />
          </Routes>
        </Box>
      </VStack>
    </Box>
  );
};

export default Courses;