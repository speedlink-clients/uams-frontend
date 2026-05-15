import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  InputGroup,
  Input,
  Select,
  Portal,
  createListCollection,
  EmptyState,
  VStack,
  Table,
  Button,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { LuSearch, LuBookOpen, LuCircleAlert } from "react-icons/lu";
import { CourseHook } from "@hooks/course.hook";
import { useCurrentUser } from "@hooks/currentUser.hook";
import useAuthStore from "@stores/auth.store";


const ITEMS_PER_PAGE = 10;

const Courses = () => {
  const { user } = useAuthStore();
  const currentSession = user?.currentSession || "All";
  const { isHOD } = useCurrentUser();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [semester, setSemester] = useState("All");
  const [session, setSession] = useState(currentSession);
  const [currentPage, setCurrentPage] = useState(1);

  // Correctly fetch data based on role
  const { data: allCourses = [], isLoading: allLoading, error: allError } = CourseHook.useAllCourses();
  const { data: assignedCourses = [], isLoading: assignedLoading, error: assignedError } = CourseHook.useAllCourses();

  const courses = isHOD ? allCourses : assignedCourses;
  const isLoading = allLoading || assignedLoading;
  const error = isHOD ? allError : assignedError;

  const dynamicSessionCollection = useMemo(() => {
    const opts = new Set<string>();
    opts.add("All");
    if (currentSession !== "All") opts.add(currentSession);
    courses.forEach(c => {
      if (c.session) opts.add(c.session);
    });
    return createListCollection({
      items: Array.from(opts).map((opt) => ({
        label: opt === "All" ? "Session" : opt,
        value: opt,
      })),
    });
  }, [currentSession, courses]);

  const dynamicLevelCollection = useMemo(() => {
    const opts = new Set<string>();
    opts.add("All");
    courses.forEach(c => {
      if (c.level) opts.add(c.level);
    });
    return createListCollection({
      items: Array.from(opts).map((opt) => ({
        label: opt === "All" ? "Level" : String(opt).replace(/^L/, "") + " Level",
        value: opt,
      })),
    });
  }, [courses]);

  const dynamicSemesterCollection = useMemo(() => {
    const opts = new Set<string>();
    opts.add("All");
    courses.forEach(c => {
      if (c.semester) opts.add(c.semester);
    });
    return createListCollection({
      items: Array.from(opts).map((opt) => {
        if (opt === "All") return { label: "Semester", value: opt };
        const label = String(opt).charAt(0).toUpperCase() + String(opt).slice(1).toLowerCase() + " Semester";
        return { label, value: opt };
      }),
    });
  }, [courses]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, level, semester, session]);

  // Filtering
  const filteredCourses = useMemo(() => {
    let filtered = courses;
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (c) => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
      );
    }
    if (level !== "All") {
      filtered = filtered.filter((c) => c.level === level);
    }
    if (semester !== "All") {
      filtered = filtered.filter((c) => c.semester === semester);
    }
    if (session !== "All") {
      filtered = filtered.filter((c) => c.session === session);
    }
    return filtered;
  }, [courses, debouncedSearch, level, semester, session]);

  const totalCount = courses.length;
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

  // Column headers (adjust based on your Course type)
  const columns = [
    "Code",
    "Title",
    "Units",
    "Level",
    "Semester",
    "Session",
    "Course Type",
  ];

  return (
    <Box>
      {/* Heading */}
      <Flex align="baseline" gap="2" mb="6">
        <Heading color="fg.muted" mb="0">
          Courses
        </Heading>
        <Text as="span" color="fg.subtle" fontSize="lg">
          ({totalCount})
        </Text>
      </Flex>

      <Box bg="white" rounded="md" border="1px solid" borderColor="border.muted" p="5">
        {/* Filters row */}
        <Flex align="center" justify="flex-end" mb="5" gap="4" wrap="wrap" colorPalette={"accent"}>
          <InputGroup startElement={<LuSearch />} width="260px">
            <Input
              placeholder="Search by title or code"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fontSize="xs"
            />
          </InputGroup>

          <Flex gap="3" wrap="wrap">
            {/* Level filter */}
            <Select.Root
              collection={dynamicLevelCollection}
              value={[level]}
              onValueChange={(e) => setLevel(e.value[0])}
              size="md"
              width="100px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Level" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {dynamicLevelCollection.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>

            {/* Semester filter */}
            <Select.Root
              collection={dynamicSemesterCollection}
              value={[semester]}
              onValueChange={(e) => setSemester(e.value[0])}
              size="md"
              width="140px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Semester" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {dynamicSemesterCollection.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>

            {/* Session (season) filter */}
            <Select.Root
              collection={dynamicSessionCollection}
              value={[session]}
              onValueChange={(e) => setSession(e.value[0])}
              size="md"
              width="120px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Session" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {dynamicSessionCollection.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Flex>
        </Flex>

        {/* Table */}
        <Table.ScrollArea>
          <Table.Root size="sm" variant="outline">
            <Table.Header>
              <Table.Row>
                {columns.map((col) => (
                  <Table.ColumnHeader key={col}>{col}</Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isLoading && (
                <Table.Row>
                  <Table.Cell colSpan={columns.length} textAlign="center" py={10}>
                    <Center>
                      <Spinner size="lg" color="accent.500" />
                    </Center>
                  </Table.Cell>
                </Table.Row>
              )}

              {!isLoading && error && (
                <Table.Row>
                  <Table.Cell colSpan={columns.length} textAlign="center" py={10}>
                    <EmptyState.Root>
                      <EmptyState.Content>
                        <EmptyState.Indicator>
                          <LuCircleAlert />
                        </EmptyState.Indicator>
                        <VStack textAlign="center">
                          <EmptyState.Title>Failed to load courses</EmptyState.Title>
                          <EmptyState.Description>{error.message}</EmptyState.Description>
                        </VStack>
                      </EmptyState.Content>
                    </EmptyState.Root>
                  </Table.Cell>
                </Table.Row>
              )}

              {!isLoading && !error && paginatedCourses.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={columns.length} textAlign="center" py={10}>
                    <EmptyState.Root>
                      <EmptyState.Content>
                        <EmptyState.Indicator>
                          <LuBookOpen />
                        </EmptyState.Indicator>
                        <VStack textAlign="center">
                          <EmptyState.Title>No courses found</EmptyState.Title>
                          <EmptyState.Description>
                            {courses.length === 0
                              ? "No courses have been created yet."
                              : "Try adjusting your search or filters."}
                          </EmptyState.Description>
                        </VStack>
                      </EmptyState.Content>
                    </EmptyState.Root>
                  </Table.Cell>
                </Table.Row>
              )}

              {!isLoading && !error && paginatedCourses.length > 0 &&
                paginatedCourses.map((course) => (
                  <Table.Row key={course.id}>
                    <Table.Cell>{course.code}</Table.Cell>
                    <Table.Cell>{course.title}</Table.Cell>
                    <Table.Cell>{course.units}</Table.Cell>
                    <Table.Cell>{course.level}</Table.Cell>
                    <Table.Cell>{course.semester}</Table.Cell>
                    <Table.Cell>{course.session || "—"}</Table.Cell>
                    <Table.Cell>{course.courseType}</Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>

        {/* Pagination – always visible */}
        <Flex
          alignItems="center"
          justifyContent="space-between"
          bg="white"
          rounded="md"
          border="1px solid"
          borderColor="border.muted"
          p="4"
          mt="4"
          wrap="wrap"
          gap="2"
        >
          <Text color="fg.muted">
            Showing{" "}
            <Text as="span" >
              {filteredCourses.length === 0 ? 0 : startIndex + 1}-
              {Math.min(endIndex, filteredCourses.length)}
            </Text>{" "}
            of <Text as="span">{filteredCourses.length}</Text> courses
          </Text>
          <Flex alignItems="center" gap="2">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || totalPages === 0}
              size="sm"
              variant="outline"
              borderColor="border.muted"
              bg="white"
              color="fg.muted"
              fontWeight="500"
            >
              Previous
            </Button>

            {totalPages === 0 ? (
              <Button
                size="sm"
                variant="solid"
                bg="accent"
                color="white"
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
              borderColor="border.muted"
              bg="white"
              color="fg.muted"
            >
              Next
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default Courses;