import { Box, Table, Text, Flex, Icon } from "@chakra-ui/react";
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
    { key: "category", label: "Category", width: "160px" },
    { key: "role", label: "Role", width: "100px" },
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
                                {lecturer.staffId}
                            </Table.Cell>
                            <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700" fontWeight="600">
                                {lecturer.name}
                            </Table.Cell>
                            <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.500">
                                {lecturer.email}
                            </Table.Cell>
                            <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700">
                                {lecturer.phoneNo}
                            </Table.Cell>
                            <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700">
                                {lecturer.category}
                            </Table.Cell>
                            <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700">
                                {lecturer.role}
                            </Table.Cell>
                            <Table.Cell px="4" py="3.5">
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

export default LecturersTable;
