import { Box, Table, Text, Flex, Menu, Button, Portal, Drawer, CloseButton, For, Heading } from "@chakra-ui/react";
import { MoreHorizontal } from "lucide-react";
import type { Lecturer } from "@type/lecturer.type";

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
                <Button variant="ghost" size="xs" w="full" justifyContent={"start"}>
                    Courses
                </Button>
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header>
                            <Drawer.Title>{lecturer}</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body spaceY="4">
                            <Heading size="md" color="fg.muted">Courses</Heading>
                            <For each={courses}
                                fallback={<Text fontSize="xs" color="gray.500">No courses assigned</Text>}>
                                {({ course }) => (
                                    <Box key={course.id}
                                        border="sm"
                                        borderColor="border"
                                        rounded="md"
                                        p="4"
                                    >
                                        <Text color="fg.subtle">{course.code}</Text>
                                        <Heading size="sm">{course.title}</Heading>
                                    </Box>
                                )}
                            </For>
                        </Drawer.Body>

                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )

}
