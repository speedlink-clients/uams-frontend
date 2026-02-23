import { useState, useRef, useEffect } from "react";
import { Box, Table, Text, Flex, Icon } from "@chakra-ui/react";
import { MoreHorizontal, Eye, Pencil, ChevronDown } from "lucide-react";
import type { Project } from "@type/project.type";

interface ProjectsTableProps {
    projects: Project[];
    isLoading?: boolean;
}

const StatusBadge = ({ status }: { status: "Pending" | "Approved" }) => {
    const isPending = status === "Pending";
    return (
        <Flex
            align="center"
            gap="1"
            px="3"
            py="1"
            borderRadius="full"
            bg={isPending ? "red.50" : "green.50"}
            color={isPending ? "red.500" : "green.500"}
            fontSize="11px"
            fontWeight="500"
            w="fit-content"
            cursor="pointer"
        >
            {status}
            <ChevronDown size={12} />
        </Flex>
    );
};

const ActionMenu = () => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <Box position="relative" ref={ref}>
            <Icon
                as={MoreHorizontal}
                boxSize="4"
                color="gray.500"
                cursor="pointer"
                _hover={{ color: "gray.700" }}
                onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
            />
            {open && (
                <Box
                    position="absolute"
                    right="0"
                    top="6"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    boxShadow="md"
                    py="1"
                    zIndex="10"
                    minW="140px"
                >
                    <Flex
                        align="center"
                        gap="2"
                        px="3"
                        py="2"
                        cursor="pointer"
                        _hover={{ bg: "gray.50" }}
                        onClick={() => setOpen(false)}
                    >
                        <Eye size={14} color="#718096" />
                        <Text fontSize="xs" color="gray.700">View Project</Text>
                    </Flex>
                    <Flex
                        align="center"
                        gap="2"
                        px="3"
                        py="2"
                        cursor="pointer"
                        _hover={{ bg: "gray.50" }}
                        onClick={() => setOpen(false)}
                    >
                        <Pencil size={14} color="#718096" />
                        <Text fontSize="xs" color="gray.700">Edit</Text>
                    </Flex>
                </Box>
            )}
        </Box>
    );
};

const COLUMNS = [
    { key: "sn", label: "S/N", width: "50px" },
    { key: "topic", label: "Project Topic", width: "200px" },
    { key: "projectType", label: "Project Type", width: "120px" },
    { key: "studentName", label: "Student name", width: "160px" },
    { key: "status", label: "Status", width: "120px" },
    { key: "action", label: "Action", width: "70px" },
] as const;

const ProjectsTable = ({ projects, isLoading }: ProjectsTableProps) => {
    if (isLoading) {
        return (
            <Flex justify="center" py="12">
                <Text color="gray.500" fontSize="sm">Loading projects...</Text>
            </Flex>
        );
    }

    if (projects.length === 0) {
        return (
            <Flex justify="center" py="12">
                <Text color="gray.500" fontSize="sm">No projects found.</Text>
            </Flex>
        );
    }

    return (
        <Box borderRadius="lg" border="1px solid" borderColor="gray.100" bg="white" overflowX="auto">
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
                    {projects.map((project, index) => (
                        <Table.Row
                            key={project.id}
                            _hover={{ bg: "gray.50" }}
                            transition="background 0.15s"
                        >
                            <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.600">
                                {index + 1}
                            </Table.Cell>
                            <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700">
                                {project.topic}
                            </Table.Cell>
                            <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700">
                                {project.projectType}
                            </Table.Cell>
                            <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700">
                                {project.studentNames.map((name, i) => (
                                    <Text key={i} fontSize="xs" lineHeight="tall">
                                        {name}
                                    </Text>
                                ))}
                            </Table.Cell>
                            <Table.Cell px="4" py="3.5">
                                <StatusBadge status={project.status} />
                            </Table.Cell>
                            <Table.Cell px="4" py="3.5">
                                <ActionMenu />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Box>
    );
};

export default ProjectsTable;
