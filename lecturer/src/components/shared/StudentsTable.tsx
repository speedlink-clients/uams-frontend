import { Box, Table, Text, Flex, Icon } from "@chakra-ui/react";
import { MoreHorizontal } from "lucide-react";
import type { Student } from "@type/student.type";

interface StudentsTableProps {
    students: Student[];
    isLoading?: boolean;
}

const COLUMNS = [
    { key: "sn", label: "S/N", width: "50px" },
    { key: "regNo", label: "Reg No.", width: "140px" },
    { key: "matNo", label: "Mat. No.", width: "130px" },
    { key: "surname", label: "Surname", width: "100px" },
    { key: "otherNames", label: "Other Names", width: "130px" },
    { key: "email", label: "Email", width: "180px" },
    { key: "phoneNo", label: "Phone No", width: "140px" },
    { key: "sex", label: "Sex", width: "60px" },
    { key: "admissionMode", label: "Admission Mode", width: "120px" },
    { key: "entryQualification", label: "Entry Qualification", width: "130px" },
    { key: "faculty", label: "Faculty", width: "110px" },
    { key: "department", label: "Department", width: "140px" },
    { key: "degreeCourse", label: "Degree Course", width: "140px" },
    { key: "courseDuration", label: "Course Duration", width: "110px" },
    { key: "degreeAwardCode", label: "Degree Award Code", width: "130px" },
    { key: "action", label: "Action", width: "60px" },
] as const;

/* Shared sticky cell styles */
const stickyLeft = {
    position: "sticky" as const,
    left: 0,
    bg: "white",
    zIndex: 2,
    borderRight: "1px solid",
    borderColor: "gray.100",
};

const stickyRight = {
    position: "sticky" as const,
    right: 0,
    bg: "white",
    zIndex: 2,
    borderLeft: "1px solid",
    borderColor: "gray.100",
};

const stickyLeftHeader = { ...stickyLeft, bg: "gray.50", zIndex: 3 };
const stickyRightHeader = { ...stickyRight, bg: "gray.50", zIndex: 3 };

const StudentsTable = ({ students, isLoading }: StudentsTableProps) => {
    if (isLoading) {
        return (
            <Flex justify="center" py="12">
                <Text color="gray.500" fontSize="sm">Loading students...</Text>
            </Flex>
        );
    }

    if (students.length === 0) {
        return (
            <Flex justify="center" py="12">
                <Text color="gray.500" fontSize="sm">No students found.</Text>
            </Flex>
        );
    }

    return (
        <Box
            overflowX="auto"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.100"
            bg="white"
            maxW="calc(100vw - 260px - 48px)"
        >
            <Table.Root size="sm" variant="line" css={{ tableLayout: "auto" }}>
                <Table.Header>
                    <Table.Row bg="gray.50">
                        {COLUMNS.map((col, i) => (
                            <Table.ColumnHeader
                                key={col.key}
                                fontSize="xs"
                                fontWeight="600"
                                color="gray.600"
                                textTransform="none"
                                minW={col.width}
                                px="3"
                                py="3"
                                whiteSpace="nowrap"
                                {...(i === 0 ? stickyLeftHeader : {})}
                                {...(i === COLUMNS.length - 1 ? stickyRightHeader : {})}
                            >
                                {col.label}
                            </Table.ColumnHeader>
                        ))}
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {students.map((student, index) => (
                        <Table.Row
                            key={student.id}
                            _hover={{ bg: "gray.50" }}
                            transition="background 0.15s"
                        >
                            {/* S/N — sticky left */}
                            <Table.Cell px="3" py="3" fontSize="xs" color="gray.600" {...stickyLeft}>
                                {index + 1}
                            </Table.Cell>
                            <Table.Cell px="3" py="3" fontFamily="Inter" fontSize="12px" color="gray.700" fontWeight="500">
                                {student.regNo}
                            </Table.Cell>
                            <Table.Cell px="3" py="3" fontFamily="Inter" fontSize="12px" color="gray.700" fontWeight="500">
                                {student.matNo}
                            </Table.Cell>
                            <Table.Cell px="3" py="3" fontFamily="Inter" fontStyle="semi-bold" fontSize="13px" color="gray.700" fontWeight="700">
                                {student.surname}
                            </Table.Cell>
                            <Table.Cell px="3" py="3" fontFamily="Inter" fontStyle="semi-bold" fontSize="13px" color="gray.700" fontWeight="700">
                                {student.otherNames}
                            </Table.Cell>
                            <Table.Cell px="3" py="3" fontFamily="Inter" fontSize="12px" color="gray.500" fontWeight="500">
                                {student.email}
                            </Table.Cell>
                            <Table.Cell px="3" py="3" fontFamily="Inter" fontSize="12px" color="gray.700" fontWeight="500">
                                {student.phoneNo}
                            </Table.Cell>
                            <Table.Cell px="3" py="3" fontFamily="Inter" fontSize="12px" color="gray.700" fontWeight="500">
                                {student.sex}
                            </Table.Cell>
                            <Table.Cell px="3" py="3" fontFamily="Inter" fontSize="12px" color="gray.700" fontWeight="500">
                                {student.admissionMode}
                            </Table.Cell>
                            <Table.Cell px="3" py="3" fontFamily="Inter" fontSize="12px" color="gray.700" fontWeight="500">
                                {student.entryQualification}
                            </Table.Cell>
                            <Table.Cell px="3" py="3" fontFamily="Inter" fontSize="12px" color="gray.700" fontWeight="500">
                                {student.faculty}
                            </Table.Cell>
                            <Table.Cell px="3" py="3" fontFamily="Inter" fontSize="12px" color="gray.700" fontWeight="500">
                                {student.department}
                            </Table.Cell>
                            <Table.Cell px="3" py="3" fontFamily="Inter" fontSize="12px" color="gray.700" fontWeight="500">
                                {student.degreeCourse}
                            </Table.Cell>
                            <Table.Cell px="3" py="3" fontFamily="Inter" fontSize="12px" color="gray.700" fontWeight="500">
                                {student.courseDuration}
                            </Table.Cell>
                            <Table.Cell px="3" py="3" fontFamily="Inter" fontSize="12px" color="gray.700" fontWeight="500">
                                {student.degreeAwardCode}
                            </Table.Cell>
                            {/* Action — sticky right */}
                            <Table.Cell px="3" py="3" {...stickyRight}>
                                <Icon
                                    as={MoreHorizontal}
                                    boxSize="4"
                                    color="gray.500"
                                    cursor="pointer"
                                    _hover={{ color: "gray.700" }}
                                />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Box>
    );
};

export default StudentsTable;

