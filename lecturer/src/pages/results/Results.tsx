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
} from "@chakra-ui/react";
import { ChevronRight, Search } from "lucide-react";
import { CourseHook } from "@hooks/course.hook";
import { useNavigate } from "react-router";
import useUserStore from "@stores/user.store";
import type { AuthUser } from "@type/user.type";

const Results = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedLevelId, setSelectedLevelId] = useState<string>("all");
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>("all");

  // Get current user role from store
  const user = useUserStore((state) => state.user) as AuthUser | null;
  const isHOD = user?.role === "HOD";

  // Conditionally fetch courses based on role
  const { data: allCourses = [], isLoading: allLoading } = CourseHook.useCourses({
    enabled: isHOD,
  });
  const { data: assignedCourses = [], isLoading: assignedLoading } = CourseHook.useAssignedCourses({
    enabled: !isHOD,
  });

  const courses = isHOD ? allCourses : assignedCourses;
  const isLoading = allLoading || assignedLoading; // only one query runs

  // Extract unique level options from the fetched courses
  const levelOptions = useMemo(() => {
    const levelsMap = new Map<string, string>();
    courses.forEach((course) => {
      if (course.level?.id && course.level?.name) {
        levelsMap.set(course.level.id, course.level.name);
      }
    });
    return Array.from(levelsMap.entries()).map(([id, name]) => ({ id, name }));
  }, [courses]);

  // Extract unique semester options from the fetched courses
  const semesterOptions = useMemo(() => {
    const semestersMap = new Map<string, string>();
    courses.forEach((course) => {
      if (course.semester?.id && course.semester?.name) {
        semestersMap.set(course.semester.id, course.semester.name);
      }
    });
    return Array.from(semestersMap.entries()).map(([id, name]) => ({ id, name }));
  }, [courses]);

  // Build collections for Chakra Select
  const levelCollection = useMemo(
    () =>
      createListCollection({
        items: [
          { label: "Levels", value: "all" },
          ...levelOptions.map((level) => ({ label: level.name, value: level.id })),
        ],
      }),
    [levelOptions]
  );

  const semesterCollection = useMemo(
    () =>
      createListCollection({
        items: [
          { label: "Semesters", value: "all" },
          ...semesterOptions.map((sem) => ({ label: sem.name, value: sem.id })),
        ],
      }),
    [semesterOptions]
  );

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
      filtered = filtered.filter((c) => c.levelId === selectedLevelId);
    }

    if (selectedSemesterId !== "all") {
      filtered = filtered.filter((c) => c.semesterId === selectedSemesterId);
    }

    return filtered;
  }, [courses, search, selectedLevelId, selectedSemesterId]);

  if (isLoading) return <Text>Loading courses...</Text>;

  return (
    <Box>
      <Heading size="lg" fontWeight="600" color="#000000" mb="5" fontSize="24px">
        Results
      </Heading>

      <Box bg="white" borderRadius="lg" border="1px solid" borderColor="gray.100" p="5">
        <Flex align="center" justify="space-between" mb="5" gap="4">
          {/* Search */}
          <InputGroup startElement={<Search />} width="300px" ml="auto">
            <Input
              placeholder="Search Course"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                outline: "none",
                fontSize: "13px",
                background: "transparent",
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
              width="160px"
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
              width="160px"
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
        <Box bg="white" borderRadius="lg" border="1px solid" borderColor="gray.100">
          <Flex px="6" py="3" borderBottom="1px solid" borderColor="gray.100" bg="gray.50">
            <Text fontSize="xs" fontWeight="600" color="gray.600" w="60px">
              S/N
            </Text>
            <Text fontSize="xs" fontWeight="600" color="gray.600" w="120px">
              Code
            </Text>
            <Text fontSize="xs" fontWeight="600" color="gray.600" flex="1">
              Course Title
            </Text>
            <Box w="30px" />
          </Flex>

          {filteredCourses.map((course, index) => (
            <Flex
              key={course.id}
              align="center"
              px="6"
              py="4"
              borderBottom="1px solid"
              borderColor="gray.50"
              cursor="pointer"
              _hover={{ bg: "gray.50" }}
              transition="background 0.15s"
              onClick={() => navigate(`/results/${course.id}`, { state: { course } })}
            >
              <Text fontSize="xs" color="gray.600" w="60px">
                {index + 1}
              </Text>
              <Text fontSize="xs" color="gray.700" w="120px">
                {course.code}
              </Text>
              <Text fontSize="xs" color="gray.700" flex="1">
                {course.title}
              </Text>
              <Box w="30px" textAlign="right">
                <ChevronRight size={14} color="#A0AEC0" />
              </Box>
            </Flex>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Results;