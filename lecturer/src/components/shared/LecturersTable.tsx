import { Box, Table, Text, Flex, Menu, Button, Portal, Drawer, CloseButton, For, Heading, Spinner, InputGroup, Input } from "@chakra-ui/react";
import { MoreHorizontal, Search, User, UserRoundPen } from "lucide-react";
import type { Lecturer } from "@type/lecturer.type";
import { StudentHook } from "@hooks/student.hook";
import React, { useState } from "react";
import { AcademicHook } from "@hooks/academic.hook";
import { Checkbox } from "../ui/checkbox";
import { toaster } from "@components/ui/toaster";
import type { Student } from "@type/student.type";


interface LecturersTableProps {
    lecturers: Lecturer[];
    isLoading?: boolean;
}

const COLUMNS = [
    { key: "sn", label: "S/N", width: "60px" },
    { key: "staffId", label: "Staff ID", width: "140px" },
    { key: "name", label: "Name", width: "160px" },
    { key: "email", label: "Email", width: "200px" },
    { key: "phoneNo", label: "Phone No", width: "160px" },
    { key: "role", label: "Role", width: "100px" },
    { key: "AssignedCourse", label: "Assigned Course", width: "160px" },
    { key: "action", label: "Action", width: "70px" },
] as const;

const LecturersTable = ({ lecturers, isLoading }: LecturersTableProps) => {
    if (isLoading) {
        return (
            <Flex justify="center" py="12">
                <Text color="gray.500" fontSize="sm">Loading lecturers...</Text>
            </Flex>
        );
    }

    if (lecturers.length === 0) {
        return (
            <Flex justify="center" py="12">
                <Text color="gray.500" fontSize="sm">No lecturers found.</Text>
            </Flex>
        );
    }

    return (
       <Box
    borderRadius="lg"
    border="1px solid"
    borderColor="gray.100"
    bg="white"
    overflowX="auto"
>
    <Table.Root size="sm" variant="line" style={{ tableLayout: 'auto', minWidth: '1200px' }}>
        <Table.Header>
            <Table.Row bg="gray.50">
                {COLUMNS.map((col) => (
                    <Table.ColumnHeader
                        key={col.key}
                        fontSize="xs"
                        fontWeight="600"
                        color="gray.600"
                        textTransform="none"
                        minW={col.width}
                        px="4"
                        py="3"
                        whiteSpace="nowrap"
                    >
                        {col.label}
                    </Table.ColumnHeader>
                ))}
            </Table.Row>
        </Table.Header>

        <Table.Body>
            {lecturers.map((lecturer, index) => (
                <Table.Row
                    key={lecturer.id}
                    _hover={{ bg: "gray.50" }}
                    transition="background 0.15s"
                >
                    <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.600" whiteSpace="nowrap">
                        {index + 1}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700" whiteSpace="nowrap">
                        {lecturer.staffNumber}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700" fontWeight="600" whiteSpace="nowrap">
                        {lecturer.User.fullName}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.500" whiteSpace="nowrap">
                        {lecturer.User.email}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700" whiteSpace="nowrap">
                        {lecturer.User.phone}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700" whiteSpace="nowrap">
                        {lecturer.currentAdminRole}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700" whiteSpace="nowrap">
                        {lecturer.courseAssignments.length}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" whiteSpace="nowrap">
                        <Menu.Root>
                            <Menu.Trigger asChild>
                                <Button variant="ghost" size="xs">
                                    <MoreHorizontal />
                                </Button>
                            </Menu.Trigger>
                            <Portal>
                                <Menu.Positioner>
                                    <Menu.Content>
                                        <Menu.Item value="courses" asChild>
                                            <CourseDrawer courses={lecturer.courseAssignments} lecturer={lecturer.User.fullName} />
                                        </Menu.Item>
                                        <Menu.Item value="students" asChild>
                                            <StudentDrawer 
                                                lecturerId={lecturer.id}
                                                lecturer={lecturer.User.fullName} 
                                            />
                                        </Menu.Item>
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Portal>
                        </Menu.Root>
                    </Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table.Root>
</Box>
    );
};

export default LecturersTable;


const CourseDrawer = ({ courses, lecturer }: { courses: Lecturer["courseAssignments"], lecturer: Lecturer["User"]["fullName"] }) => {
    return (
        <Drawer.Root>
            <Drawer.Trigger asChild>
                <Button variant="ghost" size="xs" w="full" justifyContent={"start"} fontWeight="500" _focus={{ ring: "none" }}>
                    Courses
                </Button>
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content roundedLeft="xl">
                        <Drawer.Header borderBottomWidth="1px" borderColor="gray.100" py="4">
                            <Drawer.Title fontSize="lg" fontWeight="600">{lecturer}</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body spaceY="4" py="6">
                            <Heading size="sm" color="gray.600" textTransform="uppercase" letterSpacing="wider">Assigned Courses</Heading>
                            <For each={courses}
                                fallback={
                                    <Flex direction="column" align="center" justify="center" py="10" opacity="0.6">
                                        <Text fontSize="sm" color="gray.500">No courses assigned</Text>
                                    </Flex>
                                }>
                                {({ course }) => (
                                    <Box key={course.id}
                                        border="1px solid"
                                        borderColor="gray.100"
                                        rounded="lg"
                                        p="4"
                                        _hover={{ bg: "gray.50" }}
                                        transition="all 0.2s"
                                    >
                                        <Text color="blue.600" fontSize="xs" fontWeight="700" mb="1">{course.code}</Text>
                                        <Heading size="xs" fontWeight="600" color="gray.800">{course.title}</Heading>
                                    </Box>
                                )}
                            </For>
                        </Drawer.Body>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" pos="absolute" top="4" right="4" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
}

const StudentDrawer = ({ lecturerId, lecturer }: { lecturerId: string, lecturer: Lecturer["User"]["fullName"] }) => {
    const [open, setOpen] = useState(false);
    const [showAssigned, setShowAssigned] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { data: activeSession, isLoading: isSessionLoading } = AcademicHook.useActiveSession();
    const { data: students, isLoading, refetch } = StudentHook.useUnassignedStudents();
    const { 
        data: assignedStudents, 
        isLoading: isAssignedLoading, 
        refetch: refetchAssigned 
    } = StudentHook.useAssignedStudents(lecturerId);
    
    const { mutate: assignStudents, isPending: isAssigning } = StudentHook.useAssignStudents({
        onSuccess: () => {
            toaster.create({
                title: "Students assigned successfully",
                type: "success",
            });
            setSelectedStudents(new Set());
            refetch();
            refetchAssigned(); // Refresh assigned list
            setOpen(false);
        },
        onError: (error) => {
            toaster.create({
                title: "Failed to assign students",
                description: error?.response?.data?.message || "Something went wrong",
                type: "error",
            });
        }
    });

    // Remove student mutation
    const { mutate: removeStudent, isPending: isRemoving } = StudentHook.useRemoveAssignedStudent({
        onSuccess: () => {
            toaster.create({
                title: "Student removed successfully",
                type: "success",
            });
            refetchAssigned(); // Refresh assigned list
            refetch(); // Refresh unassigned list
        },
        onError: (error) => {
            toaster.create({
                title: "Failed to remove student",
                description: error?.response?.data?.message || "Something went wrong",
                type: "error",
            });
        }
    });

    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
    const [studentToRemove, setStudentToRemove] = useState<Student | null>(null);

    // Filter students based on search term
    const filteredStudents = React.useMemo(() => {
        if (!students) return [];
        if (!searchTerm.trim()) return students;
        
        const searchLower = searchTerm.toLowerCase().trim();
        return students.filter(student => {
            const fullName = (student.name || student.fullName || "").toLowerCase();
            const email = (student.email || "").toLowerCase();
            const matricNumber = (student.matricNumber || "").toLowerCase();
            
            return fullName.includes(searchLower) || 
                   email.includes(searchLower) || 
                   matricNumber.includes(searchLower);
        });
    }, [students, searchTerm]);

    // Filter assigned students based on search term
    const filteredAssignedStudents = React.useMemo(() => {
        if (!assignedStudents) return [];
        if (!searchTerm.trim()) return assignedStudents;
        
        const searchLower = searchTerm.toLowerCase().trim();
        return assignedStudents.filter(student => {
            const fullName = (student.name || student.fullName || "").toLowerCase();
            const email = (student.email || "").toLowerCase();
            const matricNumber = (student.matricNumber || "").toLowerCase();
            
            return fullName.includes(searchLower) || 
                   email.includes(searchLower) || 
                   matricNumber.includes(searchLower);
        });
    }, [assignedStudents, searchTerm]);

    const toggleStudent = (id: string) => {
        setSelectedStudents((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const isAllSelected = students && students.length > 0 && selectedStudents.size === students.length;

    const toggleAll = () => {
        if (isAllSelected) {
            setSelectedStudents(new Set());
        } else {
            setSelectedStudents(new Set(students?.map((s) => s.id)));
        }
    };

    const handleAssign = () => {
        if (selectedStudents.size === 0 || !activeSession?.id) return;
        
        assignStudents({
            lecturerId,
            sessionId: activeSession.id,
            studentIds: Array.from(selectedStudents),
            notes: "students for project supervisor"
        });
    };

    const handleRemoveStudent = () => {
        if (!studentToRemove || !activeSession?.id) return;
        
        removeStudent({
            lecturerId,
            studentId: studentToRemove.id,
            sessionId: activeSession.id
        });
        setStudentToRemove(null);
    };

    return (
        <Drawer.Root size="md" open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Drawer.Trigger asChild>
                <Button variant="ghost" size="xs" w="full" justifyContent={"start"} fontWeight="500" _focus={{ ring: "none" }}>
                    Students
                </Button>
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content roundedLeft="xl" maxW="450px">
                        <Drawer.Header borderBottomWidth="1px" borderColor="gray.100" py="4">
                            <Flex justify="space-between" align="center">
                                <Box>
                                    <Drawer.Title fontSize="lg" fontWeight="600">{lecturer}</Drawer.Title>
                                    <Text fontSize="xs" color="gray.500">Unassigned Students</Text>
                                </Box>
                                <Flex align="center" gap="2">
                                    {students && students.length > 0 && (
                                        <Text fontSize="xs" fontWeight="600" color="blue.600">
                                            {selectedStudents.size} selected
                                        </Text>
                                    )}
                                    <Button 
                                        size="xs"
                                        colorScheme="blue"
                                        onClick={() => setShowAssigned(true)}
                                        borderRadius="sm"
                                        px="3"
                                        py="1"
                                        fontSize="xs"
                                        fontWeight="600"
                                        bg="blue.600"
                                        _hover={{ bg: "blue.700" }}
                                    >
                                        {assignedStudents?.length || 0} Assigned
                                    </Button>
                                </Flex>
                            </Flex>
                        </Drawer.Header>
                        
                        {/* Search Bar */}
                        <Box px="4" py="3" borderBottomWidth="1px" borderColor="gray.100">
                            <Flex align="center" gap="2">
                                <Box flex="1">
                                    <InputGroup startElement={<Search />}>
                                        <Input
                                            type="text"
                                            placeholder="Search students..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            bg="gray.50"
                                            border="1px solid"
                                            borderColor="gray.200"
                                            _focus={{
                                                borderColor: "blue.400",
                                                bg: "white",
                                                boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)"
                                            }}
                                            pl="10"
                                        />
                                    </InputGroup>
                                </Box>
                                {searchTerm && (
                                    <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        onClick={() => setSearchTerm('')}
                                        color="gray.400"
                                        _hover={{ color: "gray.600" }}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </Flex>
                        </Box>

                        <Drawer.Body spaceY="4" py="6" pb="24" overflowY="auto">
                            {isLoading ? (
                                <Flex direction="column" align="center" justify="center" py="20" gap="2">
                                    <Spinner size="lg" color="blue.500" />
                                    <Text fontSize="sm" color="gray.500">Fetching students...</Text>
                                </Flex>
                            ) : !students || students.length === 0 ? (
                                <Flex direction="column" align="center" justify="center" py="20" gap="4">
                                    <Box bg="gray.50" p="4" rounded="full">
                                        <UserRoundPen />
                                    </Box>
                                    <Box textAlign="center">
                                        <Text fontSize="sm" fontWeight="600" color="gray.800">No students found</Text>
                                        <Text fontSize="xs" color="gray.500" mt="1">No unassigned final year students available.</Text>
                                    </Box>
                                </Flex>
                            ) : (
                                <>
                                    <Flex align="center" justify="space-between" mb="4">
                                        <Heading size="xs" color="gray.600" textTransform="uppercase" letterSpacing="wider">
                                            Students ({filteredStudents.length})
                                        </Heading>
                                        <Flex align="center" gap="2">
                                            <Text fontSize="xs" fontWeight="600" color="gray.500">Select All</Text>
                                            <Checkbox 
                                                checked={isAllSelected}
                                                onCheckedChange={toggleAll}
                                            />
                                        </Flex>
                                    </Flex>
                                    
                                    {filteredStudents.length === 0 ? (
                                        <Flex direction="column" align="center" justify="center" py="10" gap="2">
                                            <Text fontSize="sm" color="gray.500">No students match your search</Text>
                                            <Button 
                                                size="xs" 
                                                variant="ghost" 
                                                color="blue.600"
                                                onClick={() => setSearchTerm('')}
                                            >
                                                Clear search
                                            </Button>
                                        </Flex>
                                    ) : (
                                        <For each={filteredStudents}>
                                            {(student) => (
                                                <Box 
                                                    key={student.id}
                                                    border="1px solid"
                                                    borderColor={selectedStudents.has(student.id) ? "blue.200" : "gray.100"}
                                                    bg={selectedStudents.has(student.id) ? "blue.50/30" : "white"}
                                                    rounded="lg"
                                                    p="4"
                                                    position="relative"
                                                    cursor="pointer"
                                                    onClick={() => toggleStudent(student.id)}
                                                    transition="all 0.2s"
                                                    _hover={{ borderColor: "blue.200", bg: "blue.50/10" }}
                                                >
                                                    <Flex align="flex-start" justify="space-between">
                                                        <Box flex="1">
                                                            <Text fontWeight="700" fontSize="sm" color="gray.800" mb="0.5">
                                                                {student.name || student.fullName}
                                                            </Text>
                                                            <Text fontSize="xs" color="gray.500" fontWeight="500">
                                                                {student.email}
                                                            </Text>
                                                            <Flex align="center" gap="2" mt="2">
                                                                <Box px="2" py="0.5" bg="gray.100" rounded="full">
                                                                    <Text fontSize="10px" fontWeight="700" color="gray.600">
                                                                        {student.matricNumber}
                                                                    </Text>
                                                                </Box>
                                                                {student.level && (
                                                                    <Box px="2" py="0.5" bg="blue.50" rounded="full">
                                                                        <Text fontSize="10px" fontWeight="700" color="blue.600">
                                                                            Level {typeof student.level === 'string' ? student.level : student.level.name}
                                                                        </Text>
                                                                    </Box>
                                                                )}
                                                            </Flex>
                                                        </Box>
                                                        <Checkbox 
                                                            checked={selectedStudents.has(student.id)}
                                                            onCheckedChange={() => toggleStudent(student.id)}
                                                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                                        />
                                                    </Flex>
                                                </Box>
                                            )}
                                        </For>
                                    )}
                                </>
                            )}
                        </Drawer.Body>
                        
                        {students && students.length > 0 && (
                            <Box 
                                position="absolute" 
                                bottom="0" 
                                left="0" 
                                right="0" 
                                bg="white" 
                                borderTopWidth="1px" 
                                borderColor="gray.100" 
                                p="4"
                                zIndex="10"
                                borderBottomLeftRadius="xl"
                            >
                                <Button 
                                    colorScheme="blue" 
                                    w="full" 
                                    h="12"
                                    rounded="lg"
                                    fontWeight="700"
                                    onClick={handleAssign}
                                    disabled={selectedStudents.size === 0 || isAssigning || isSessionLoading || !activeSession?.id}
                                    loading={isAssigning || isSessionLoading}
                                    bg="blue.600"
                                    _hover={{ bg: "blue.700" }}
                                >
                                    Assign ({selectedStudents.size}) Selected Students
                                </Button>
                            </Box>
                        )}
                        
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" pos="absolute" top="4" right="4" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>

            {/* Assigned Students Drawer */}
            <Drawer.Root open={showAssigned} onOpenChange={(e) => setShowAssigned(e.open)} placement="start">
                <Portal>
                    <Drawer.Backdrop />
                    <Drawer.Positioner>
                        <Drawer.Content roundedRight="xl" maxW="450px">
                            <Drawer.Header borderBottomWidth="1px" borderColor="gray.100" py="4">
                                <Flex justify="space-between" align="center">
                                    <Box>
                                        <Drawer.Title fontSize="lg" fontWeight="600">{lecturer}</Drawer.Title>
                                        <Text fontSize="xs" color="gray.500">Assigned Students</Text>
                                    </Box>
                                    <Button 
                                        size="xs" 
                                        variant="ghost" 
                                        onClick={() => setShowAssigned(false)}
                                        borderRadius="full"
                                    >
                                        ✕
                                    </Button>
                                </Flex>
                            </Drawer.Header>

                            {/* Search Bar for Assigned Students */}
                            <Box px="4" py="3" borderBottomWidth="1px" borderColor="gray.100">
                                <Flex align="center" gap="2">
                                    <Box flex="1">
                                        <InputGroup startElement={<Search />}>
                                            <Input
                                                type="text"
                                                placeholder="Search assigned students..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                bg="gray.50"
                                                border="1px solid"
                                                borderColor="gray.200"
                                                _focus={{
                                                    borderColor: "blue.400",
                                                    bg: "white",
                                                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)"
                                                }}
                                                pl="10"
                                            />
                                        </InputGroup>
                                    </Box>
                                    {searchTerm && (
                                        <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            onClick={() => setSearchTerm('')}
                                            color="gray.400"
                                        >
                                            Clear
                                        </Button>
                                    )}
                                </Flex>
                            </Box>

                            <Drawer.Body spaceY="4" py="6" overflowY="auto">
                                {isAssignedLoading ? (
                                    <Flex direction="column" align="center" justify="center" py="20" gap="2">
                                        <Spinner size="lg" color="blue.500" />
                                        <Text fontSize="sm" color="gray.500">Loading assigned students...</Text>
                                    </Flex>
                                ) : !assignedStudents || assignedStudents.length === 0 ? (
                                    <Flex direction="column" align="center" justify="center" py="20" gap="4">
                                        <Box bg="gray.50" p="4" rounded="full">
                                            <User />
                                        </Box>
                                        <Box textAlign="center">
                                            <Text fontSize="sm" fontWeight="600" color="gray.800">No assigned students</Text>
                                            <Text fontSize="xs" color="gray.500" mt="1">
                                                This lecturer hasn't been assigned any students yet.
                                            </Text>
                                            <Button 
                                                size="sm" 
                                                colorScheme="blue" 
                                                mt="4"
                                                onClick={() => {
                                                    setShowAssigned(false);
                                                }}
                                            >
                                                Back to Unassigned
                                            </Button>
                                        </Box>
                                    </Flex>
                                ) : (
                                    <>
                                        <Heading size="xs" color="gray.600" textTransform="uppercase" letterSpacing="wider" mb="4">
                                            Students ({filteredAssignedStudents.length})
                                        </Heading>
                                        <For each={filteredAssignedStudents}>
                                            {(student) => (
                                                <Box 
                                                    key={student.id}
                                                    border="1px solid"
                                                    borderColor="gray.100"
                                                    bg="white"
                                                    rounded="lg"
                                                    p="4"
                                                    _hover={{ bg: "gray.50" }}
                                                    transition="all 0.2s"
                                                >
                                                    <Flex align="flex-start" justify="space-between">
                                                        <Box flex="1">
                                                            <Text fontWeight="700" fontSize="sm" color="gray.800" mb="0.5">
                                                                {student.name || student.fullName}
                                                            </Text>
                                                            <Text fontSize="xs" color="gray.500" fontWeight="500">
                                                                {student.email}
                                                            </Text>
                                                            <Flex align="center" gap="2" mt="2">
                                                                <Box px="2" py="0.5" bg="gray.100" rounded="full">
                                                                    <Text fontSize="10px" fontWeight="700" color="gray.600">
                                                                        {student.matricNumber}
                                                                    </Text>
                                                                </Box>
                                                                {student.level && (
                                                                    <Box px="2" py="0.5" bg="green.50" rounded="full">
                                                                        <Text fontSize="10px" fontWeight="700" color="green.600">
                                                                            Level {typeof student.level === 'string' ? student.level : student.level.name}
                                                                        </Text>
                                                                    </Box>
                                                                )}
                                                            </Flex>
                                                        </Box>
                                                        <Button
                                                            size="xs"
                                                            colorScheme="red"
                                                            variant="ghost"
                                                            onClick={() => setStudentToRemove(student)}
                                                            loading={isRemoving && studentToRemove?.id === student.id}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </Flex>
                                                </Box>
                                            )}
                                        </For>
                                    </>
                                )}
                            </Drawer.Body>
                            
                            <Drawer.CloseTrigger asChild>
                                <CloseButton size="sm" pos="absolute" top="4" right="4" />
                            </Drawer.CloseTrigger>
                        </Drawer.Content>
                    </Drawer.Positioner>
                </Portal>
            </Drawer.Root>

            {/* Confirmation Dialog for Removing Student */}
            <Drawer.Root open={!!studentToRemove} onOpenChange={() => setStudentToRemove(null)}>
                <Portal>
                    <Drawer.Backdrop />
                    <Drawer.Positioner>
                        <Drawer.Content rounded="xl" maxW="400px">
                            <Drawer.Header borderBottomWidth="1px" borderColor="gray.100" py="4">
                                <Drawer.Title fontSize="lg" fontWeight="600">Confirm Removal</Drawer.Title>
                            </Drawer.Header>
                            <Drawer.Body py="6">
                                <Text>
                                    Are you sure you want to remove {studentToRemove?.name || studentToRemove?.fullName} from this lecturer?
                                </Text>
                            </Drawer.Body>
                            <Drawer.Footer borderTopWidth="1px" borderColor="gray.100" py="4">
                                <Flex gap="3" justify="flex-end">
                                    <Button variant="outline" onClick={() => setStudentToRemove(null)}>
                                        Cancel
                                    </Button>
                                    <Button 
                                        colorScheme="red" 
                                        onClick={handleRemoveStudent}
                                        loading={isRemoving}
                                    >
                                        Remove
                                    </Button>
                                </Flex>
                            </Drawer.Footer>
                            <Drawer.CloseTrigger asChild>
                                <CloseButton size="sm" pos="absolute" top="4" right="4" />
                            </Drawer.CloseTrigger>
                        </Drawer.Content>
                    </Drawer.Positioner>
                </Portal>
            </Drawer.Root>
        </Drawer.Root>
    )
}
