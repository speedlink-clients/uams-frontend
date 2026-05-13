import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  Input,
  InputGroup,
  Select,
  Button,
  Table,
  createListCollection,
  EmptyState,
  VStack,
} from "@chakra-ui/react";
import { LuSearch, LuClock } from "react-icons/lu";
import type { Student } from "@type/student.type";

const LEVEL_OPTIONS = ["All", "100", "200", "300", "400", "500"];
const ITEMS_PER_PAGE = 10;

const levelCollection = createListCollection({
  items: LEVEL_OPTIONS.map((opt) => ({
    label: opt === "All" ? "All Levels" : `${opt} Level`,
    value: opt,
  })),
});


const students: Student[] = [];
const isLoading = false;
const error = null;

const Students = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, level]);

  const filteredStudents = useMemo(() => {
    if (!students.length) return [];
    return students.filter((student: Student) => {
      const levelName = student.level?.name || student.level || "";
      const matchesLevel = level === "All" || levelName === level;
      const matchesSearch =
        !debouncedSearch ||
        student.fullName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        student.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        student.matricNumber?.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesLevel && matchesSearch;
    });
  }, [students, level, debouncedSearch]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, level]);

  return (
    <Box>
      {/* Heading – always visible */}
      <Flex mb="6" gap="1" align="baseline" >
        <Heading color="fg.muted" mb="1" >
          Students{" "}
          </Heading>
          <Text as="span" color="fg.subtle" lineHeight="1.5">
            ({filteredStudents.length} total)
          </Text>
      
      </Flex>

         <Box bg="bg" rounded="md" p="4">  
      {/* Filters – always visible */}
      <Flex align="center" justify="flex-end" gap="3" mb="5" wrap="wrap" colorPalette={"accent"}>
        <InputGroup startElement={<LuSearch />} width="260px">
          <Input
            placeholder="Search by Name, Email or Mat. Num"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fontSize="xs"
          />
        </InputGroup>

        <Select.Root
          collection={levelCollection}
          value={[level]}
          onValueChange={(e) => setLevel(e.value[0])}
          size="md"
          width="160px"
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="All Levels" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Select.Positioner>
            <Select.Content>
              {LEVEL_OPTIONS.map((opt) => (
                <Select.Item key={opt} item={opt}>
                  {opt === "All" ? "All Levels" : `${opt} Level`}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      </Flex>

      {/* Table */}
      <Table.ScrollArea>
        <Table.Root size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Full Name</Table.ColumnHeader>
              <Table.ColumnHeader>Email</Table.ColumnHeader>
              <Table.ColumnHeader>Matric Number</Table.ColumnHeader>
              <Table.ColumnHeader>Level</Table.ColumnHeader>
              <Table.ColumnHeader>Registration No.</Table.ColumnHeader>
              <Table.ColumnHeader>Phone</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
          
            <Table.Row>
              <Table.Cell colSpan={6} textAlign="center" py={10}>
                <EmptyState.Root>
                  <EmptyState.Content>
                    <EmptyState.Indicator>
                      <LuClock />
                    </EmptyState.Indicator>
                    <VStack textAlign="center">
                      <EmptyState.Title>No student data available.</EmptyState.Title>
                      <EmptyState.Description>
                        Try adjusting your search or filters.
                      </EmptyState.Description>
                    </VStack>
                  </EmptyState.Content>
                </EmptyState.Root>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      
      <Flex
        alignItems="center"
        justifyContent="space-between"
        bg="white"
        borderRadius="2xl"
        border="1px solid"
        borderColor="border.subtle"
        p="4"
        mt="4"
        wrap="wrap"
        gap="2"
      >
        <Text fontSize="sm" color="gray.500">
          Showing{" "}
          <Text as="span" fontWeight="semibold">
            {filteredStudents.length === 0 ? 0 : startIndex + 1}-
            {Math.min(endIndex, filteredStudents.length)}
          </Text>{" "}
          of <Text as="span" fontWeight="semibold">{filteredStudents.length}</Text> students
        </Text>
        <Flex alignItems="center" gap="2">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || totalPages === 0}
            size="sm"
            variant="outline"
            borderColor="border.subtle"
            bg="white"
            color="gray.700"
            fontWeight="500"
          >
            Previous
          </Button>

          {totalPages === 0 ? (
            <Button
              size="sm"
              variant="solid"
              bg="#1D7AD9"
              color="white"
              fontWeight="medium"
              minW="36px"
            >
              1
            </Button>
          ) : (
            Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              const isActive = currentPage === pageNum;
              return (
                <Button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  size="sm"
                  variant={isActive ? "solid" : "outline"}
                  bg={isActive ? "#1D7AD9" : "white"}
                  color={isActive ? "white" : "gray.700"}
                  borderColor={isActive ? "transparent" : "gray.200"}
                  fontWeight="medium"
                  minW="36px"
                >
                  {pageNum}
                </Button>
              );
            })
          )}

          <Button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            size="sm"
            variant="outline"
            borderColor="border.subtle"
            bg="white"
            color="gray.700"
            fontWeight="500"
          >
            Next
          </Button>
        </Flex>
      </Flex>
      </Box>
    </Box>
  );
};

export default Students;