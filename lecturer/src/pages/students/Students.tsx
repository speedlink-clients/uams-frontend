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
  createListCollection,
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { StudentHook } from "@hooks/student.hook";
import StudentsTable from "@components/shared/StudentsTable";
import type { Student } from "@type/student.type";

const LEVEL_OPTIONS = ["All", "100", "200", "300", "400", "500"];
const ITEMS_PER_PAGE = 10;

const levelCollection = createListCollection({
  items: LEVEL_OPTIONS.map((opt) => ({
    label: opt === "All" ? "All Levels" : `${opt} Level`,
    value: opt,
  })),
});

const getLevelName = (student: Student): string => {
  if (!student.level) return "";
  if (typeof student.level === "string") return student.level;
  return student.level.name || "";
};

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

  const { data: students = [], isLoading } = StudentHook.useStudents();

  const filteredStudents = useMemo(() => {
    if (!students.length) return [];

    return students.filter((student: Student) => {
      const levelName = getLevelName(student);
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


  return (
    <Box>
      <Box mb="6">
        <Heading size="lg" fontWeight="600" color="#000000" mb="1" fontSize="24px">
          Students{" "}
          <Text as="span" fontWeight="400" color="gray.400" fontSize="lg">
            ({filteredStudents.length} total)
          </Text>
        </Heading>
        <Text fontSize="sm" color="gray.500" maxW="400px">
          This table contains a list of all students to edit, create ID card and assign roles to.
        </Text>
      </Box>

      <Flex align="center" justify="flex-end" gap="3" mb="5">
        <InputGroup startElement={<LuSearch />}>
          <Input
            placeholder="Search by Name, Email or Mat. Num"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fontSize="xs"
            width="260px"
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

      <StudentsTable students={paginatedStudents} isLoading={isLoading} />

      {totalPages > 1 && (
        <Flex
          alignItems="center"
          justifyContent="space-between"
          bg="white"
          borderRadius="2xl"
          border="1px solid"
          borderColor="border.subtle"
          p="4"
          mt="4"
        >
          <Text fontSize="sm" color="gray.500">
            Showing{" "}
            <Text as="span" fontWeight="semibold">
              {startIndex + 1}-{Math.min(endIndex, filteredStudents.length)}
            </Text>{" "}
            of <Text as="span" fontWeight="semibold">{filteredStudents.length}</Text> students
            (Total: {students.length})
          </Text>
          <Flex alignItems="center" gap="2">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              size="sm"
              variant="outline"
              borderColor="border.subtle"
              bg="white"
              color="gray.700"
              fontWeight="500"
            >
              Previous
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
            })}

            <Button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
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
      )}
    </Box>
  );
};

export default Students;