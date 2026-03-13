import { Box, Table, Text, Flex, Menu, Button, Portal, Drawer, CloseButton, For, Heading, Spinner } from "@chakra-ui/react";
import { MoreHorizontal } from "lucide-react";
import type { Lecturer } from "@type/lecturer.type";
import { StudentHook } from "@hooks/student.hook";
import React, { useState } from "react";
import { AcademicHook } from "@hooks/academic.hook";
import { Checkbox } from "../ui/checkbox";
import { toaster } from "@components/ui/toaster";


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
            <Table.Root size="sm" variant="line">
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
                            <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.600">
                                {index + 1}
                            </Table.Cell>
                            <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700">
                                {lecturer.staffNumber}
                            </Table.Cell>
                            <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700" fontWeight="600">
                                {lecturer.User.fullName}
                            </Table.Cell>
                            <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.500">
                                {lecturer.User.email}
                            </Table.Cell>
                            <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700">
                                {lecturer.User.phone}
                            </Table.Cell>
                            <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700">
                                {lecturer.currentAdminRole}
                            </Table.Cell>
                            <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700">
                                {lecturer.courseAssignments.length}
                            </Table.Cell>
                            <Table.Cell px="4" py="3.5">
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
                <Button variant="ghost" size="xs" w="full" justifyContent={"start"} fontWeight="500">
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
    const { data: activeSession, isLoading: isSessionLoading } = AcademicHook.useActiveSession();
    const { data: students, isLoading, refetch } = StudentHook.useUnassignedStudents();
    const { mutate: assignStudents, isPending: isAssigning } = StudentHook.useAssignStudents({
        onSuccess: () => {
            toaster.create({
                title: "Students assigned successfully",
                type: "success",
            });
            setSelectedStudents(new Set());
            refetch();
        },
        onError: (error) => {
            toaster.create({
                title: "Failed to assign students",
                description: error?.response?.data?.message || "Something went wrong",
                type: "error",
            });
        }
    });

    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());

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
            notes: "students for project supervisor" // Hardcoded per requirement
        });
    };

    return (
        <Drawer.Root size="md">
            <Drawer.Trigger asChild>
                <Button variant="ghost" size="xs" w="full" justifyContent={"start"} fontWeight="500">
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
                                {students && students.length > 0 && (
                                    <Flex align="center" gap="2">
                                        <Text fontSize="xs" fontWeight="600" color="blue.600">
                                            {selectedStudents.size} selected
                                        </Text>
                                    </Flex>
                                )}
                            </Flex>
                        </Drawer.Header>
                        <Drawer.Body spaceY="4" py="6" pb="24">
                            {isLoading ? (
                                <Flex direction="column" align="center" justify="center" py="20" gap="2">
                                    <Spinner size="lg" color="blue.500" />
                                    <Text fontSize="sm" color="gray.500">Fetching students...</Text>
                                </Flex>
                            ) : !students || students.length === 0 ? (
                                <Flex direction="column" align="center" justify="center" py="20" gap="4">
                                    <Box bg="gray.50" p="4" rounded="full">
                                        <Text fontSize="2xl">👨‍🎓</Text>
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
                                            Students ({students.length})
                                        </Heading>
                                        <Flex align="center" gap="2">
                                            <Text fontSize="xs" fontWeight="600" color="gray.500">Select All</Text>
                                            <Checkbox 
                                                checked={isAllSelected}
                                                onCheckedChange={toggleAll}
                                            />
                                        </Flex>
                                    </Flex>
                                    <For each={students}>
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
        </Drawer.Root>
    )
}
