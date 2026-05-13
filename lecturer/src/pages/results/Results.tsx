import { useState, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  InputGroup,
  Input,
  createListCollection,
  Select,
  Portal,
  EmptyState,
  VStack,
} from "@chakra-ui/react";
import { ChevronRight, Search } from "lucide-react";
import { LuBookOpen } from "react-icons/lu";
import { CourseHook } from "@hooks/course.hook";
import { useNavigate } from "react-router";
import type { AuthUser } from "@type/user.type";
import useAuthStore from "@stores/auth.store";

const Results = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedLevelId, setSelectedLevelId] = useState<string>("all");
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>("all");

  // Get current user role from store
  const user = useAuthStore((state) => state.user) as AuthUser | null;
  const isHOD = user?.role === "HOD";

  // Conditionally fetch courses based on role
  const { data: allCourses = [], isLoading: allLoading } = CourseHook.useAllCourses();
  const { data: assignedCourses = [], isLoading: assignedLoading } = CourseHook.useAllCourses();

  const courses = isHOD ? allCourses : assignedCourses;
  const isLoading = allLoading || assignedLoading; // only one query runs

  const levelCollection = useMemo(() => {
    const opts = new Set<string>();
    courses.forEach((c) => {
      if (c.level) opts.add(c.level);
    });
    return createListCollection({
      items: [
        { label: "Level", value: "all" },
        ...Array.from(opts).map((opt) => ({
          label: String(opt).replace(/^L/, "") + " Level",
          value: opt,
        })),
      ],
    });
  }, [courses]);

  const semesterCollection = useMemo(() => {
    const opts = new Set<string>();
    courses.forEach((c) => {
      if (c.semester) opts.add(c.semester);
    });
    return createListCollection({
      items: [
        { label: "Semester", value: "all" },
        ...Array.from(opts).map((opt) => ({
          label: String(opt).charAt(0).toUpperCase() + String(opt).slice(1).toLowerCase() + " Semester",
          value: opt,
        })),
      ],
    });
  }, [courses]);

  // Apply search + level + semester filters
  const filteredCourses = useMemo(() => {
    let filtered = courses;

    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (c) => c.title.toLowerCase().includes(query) || c.code.toLowerCase().includes(query)
      );
    }

    if (selectedLevelId !== "all") {
      filtered = filtered.filter((c) => c.level === selectedLevelId);
    }

    if (selectedSemesterId !== "all") {
      filtered = filtered.filter((c) => c.semester === selectedSemesterId);
    }

    return filtered;
  }, [courses, search, selectedLevelId, selectedSemesterId]);

  if (isLoading) return <Text>Loading courses...</Text>;

  return (
    <Box>
      <Heading color="fg.muted" mb="5">
        Results
      </Heading>

      <Box bg="white" rounded="md" border="1px solid" borderColor="border.muted" p="5">
        <Flex align="center" justify="space-between" mb="5" gap="4" colorPalette={"accent"}>
          {/* Search */}
          <InputGroup startElement={<Search />} width="300px" ml="auto">
            <Input
              placeholder="Search Course"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                outline: "none",
                fontSize: "13px",
              }}
            />
          </InputGroup>

          {/* Level & Semester Filters (Chakra Select) */}
          <Flex gap="3">
            {/* Level Filter */}
            <Select.Root
              value={[selectedLevelId]}
              onValueChange={(e) => setSelectedLevelId(e.value[0])}
              collection={levelCollection}
              size="sm"
              variant="outline"
              width="120px"
            >
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Levels" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {levelCollection.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>

            {/* Semester Filter */}
            <Select.Root
              value={[selectedSemesterId]}
              onValueChange={(e) => setSelectedSemesterId(e.value[0])}
              collection={semesterCollection}
              size="sm"
              variant="outline"
              width="150px"
              fontSize="xs"
            >
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Semesters" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {semesterCollection.items.map((item) => (
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

        {/* Course List Table */}
        <Box bg="white" rounded="md" border="1px solid" borderColor="border.muted">
          <Flex px="6" py="3" borderBottom="1px solid" borderColor="border.muted" >
            <Text fontSize="xs"  color="fg.muted" w="60px">
              S/N
            </Text>
            <Text fontSize="xs" fontWeight="600" color="fg.muted" w="120px">
              Code
            </Text>
            <Text fontSize="xs" fontWeight="600" color="fg.muted" flex="1">
              Course Title
            </Text>
            <Box w="30px" />
          </Flex>

          {filteredCourses.length === 0 ? (
            <Flex justify="center" py={10}>
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
            </Flex>
          ) : (
            filteredCourses.map((course, index) => (
              <Flex
                key={course.id}
                align="center"
                px="6"
                py="4"
                borderBottom="1px solid"
                borderColor="border.muted"
                cursor="pointer"
                onClick={() => navigate(`/results/${course.id}`, { state: { course } })}
              >
                <Text fontSize="xs" color="fg.muted" w="60px">
                  {index + 1}
                </Text>
                <Text fontSize="xs" color="fg.muted" w="120px">
                  {course.code}
                </Text>
                <Text fontSize="xs" color="fg.muted" flex="1">
                  {course.title}
                </Text>
                <Box w="30px" textAlign="right">
                  <ChevronRight size={14} />
                </Box>
              </Flex>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Results;