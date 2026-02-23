import { Box, Table, Text, Flex, Icon } from "@chakra-ui/react";
import { Search } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import type { CourseStudent } from "@type/course.type";

interface CourseStudentsTableProps {
    students: CourseStudent[];
    isLoading?: boolean;
    search: string;
    onSearchChange: (value: string) => void;
}

const COLUMNS = [
    { key: "sn", label: "S/N", width: "50px" },
    { key: "regNo", label: "Reg No.", width: "130px" },
    { key: "matNo", label: "Mat. No.", width: "120px" },
    { key: "surname", label: "Surname", width: "100px" },
    { key: "otherNames", label: "Other Names", width: "120px" },
    { key: "email", label: "Email", width: "180px" },
    { key: "phoneNo", label: "Phone No", width: "140px" },
    { key: "sex", label: "Sex", width: "60px" },
    { key: "admissionMode", label: "Admission Mode", width: "110px" },
    { key: "entryQualification", label: "Entry Qualification", width: "120px" },
] as const;

const CourseStudentsTable = ({ students, isLoading, search, onSearchChange }: CourseStudentsTableProps) => {
    const navigate = useNavigate();
    const { courseId } = useParams();

    return (
        <Box>
            {/* Search */}
            <Flex
                align="center"
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                px="3"
                py="1.5"
                w="260px"
                mb="5"
            >
                <input
                    placeholder="Search Student"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    style={{
                        border: "none",
                        outline: "none",
                        fontSize: "12px",
                        width: "100%",
                        background: "transparent",
                    }}
                />
                <Icon as={Search} boxSize="4" color="gray.400" ml="2" />
            </Flex>

            {isLoading ? (
                <Flex justify="center" py="12">
                    <Text color="gray.500" fontSize="sm">Loading students...</Text>
                </Flex>
            ) : students.length === 0 ? (
                <Flex justify="center" py="12">
                    <Text color="gray.500" fontSize="sm">No students found.</Text>
                </Flex>
            ) : (
                <Box overflowX="auto" borderRadius="lg" border="1px solid" borderColor="gray.100" bg="white">
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
                                        px="3"
                                        py="3"
                                        whiteSpace="nowrap"
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
                                    cursor="pointer"
                                    transition="background 0.15s"
                                    onClick={() => navigate(`/courses/${courseId}/students/${student.id}`)}
                                >
                                    <Table.Cell px="3" py="3" fontSize="xs" color="gray.600">{index + 1}</Table.Cell>
                                    <Table.Cell px="3" py="3" fontSize="xs" color="gray.700">{student.regNo}</Table.Cell>
                                    <Table.Cell px="3" py="3" fontSize="xs" color="gray.700">{student.matNo}</Table.Cell>
                                    <Table.Cell px="3" py="3" fontSize="xs" color="gray.700" fontWeight="600">{student.surname}</Table.Cell>
                                    <Table.Cell px="3" py="3" fontSize="xs" color="gray.700" fontWeight="500">{student.otherNames}</Table.Cell>
                                    <Table.Cell px="3" py="3" fontSize="xs" color="gray.500">{student.email}</Table.Cell>
                                    <Table.Cell px="3" py="3" fontSize="xs" color="gray.700">{student.phoneNo}</Table.Cell>
                                    <Table.Cell px="3" py="3" fontSize="xs" color="gray.700">{student.sex}</Table.Cell>
                                    <Table.Cell px="3" py="3" fontSize="xs" color="gray.700">{student.admissionMode}</Table.Cell>
                                    <Table.Cell px="3" py="3" fontSize="xs" color="gray.700">{student.entryQualification}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>
            )}
        </Box>
    );
};

export default CourseStudentsTable;
