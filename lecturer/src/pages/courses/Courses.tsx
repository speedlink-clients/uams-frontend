import { useState, useMemo } from "react";
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
} from "@chakra-ui/react";
import { Search } from "lucide-react";
import { CourseHook } from "@hooks/course.hook";
import CourseList from "@components/shared/CourseList";
import { useCurrentUser } from "@hooks/currentUser.hook";

const LEVEL_OPTIONS = ["All", "100", "200", "300", "400", "500"];
const SEMESTER_OPTIONS = ["All", "First Semester", "Second Semester"];

const levelCollection = createListCollection({
  items: LEVEL_OPTIONS.map((opt) => ({
    label: opt === "All" ? "Level" : `${opt} Level`,
    value: opt,
  })),
});

const semesterCollection = createListCollection({
  items: SEMESTER_OPTIONS.map((opt) => ({
    label: opt === "All" ? "Semester" : opt,
    value: opt,
  })),
});

const Courses = () => {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [semester, setSemester] = useState("All");

  const { isHOD } = useCurrentUser();

  
  const { data: allCourses = [], isLoading: allLoading } = CourseHook.useAllCourses();
  const { data: assignedCourses = [], isLoading: assignedLoading } = CourseHook.useAllCourses();

  const courses = isHOD ? allCourses : assignedCourses;
  const isLoading = allLoading || assignedLoading;

  const filteredCourses = useMemo(() => {
    let filtered = courses;
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (c) => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
      );
    }
    if (level !== "All") {
      // API level format: "L100", "L200", etc.
      filtered = filtered.filter((c) => c.level === `L${level}`);
    }
    if (semester !== "All") {
      // API semester format: "FIRST", "SECOND"
      const semesterMap = { "First Semester": "FIRST", "Second Semester": "SECOND" };
      filtered = filtered.filter((c) => c.semester === semesterMap[semester]);
    }
    return filtered;
  }, [courses, search, level, semester]);

  const totalCount = courses.length;

  return (
    <Box>
      <Heading  color="fg.muted" mb="5" fontSize="24px">
        Courses{" "}
        <Text as="span" color="fg.subtle" fontSize="lg">
          ({totalCount})
        </Text>
      </Heading>

      <Box bg="white" rounded="md" border="1px solid" borderColor="border.muted" p="5">
        <Flex align="center" justify="flex-end" mb="5" gap="4">
          <InputGroup startElement={<Search />}>
            <Input
              placeholder="Search Course"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fontSize="13px"
              width="300px"
              borderColor="border.muted"
            />
          </InputGroup>

          <Flex gap="3">
            {/* Level Filter */}
            <Select.Root
              collection={levelCollection}
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
              collection={semesterCollection}
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

        <CourseList courses={filteredCourses} isLoading={isLoading} />
      </Box>
    </Box>
  );
};

export default Courses;