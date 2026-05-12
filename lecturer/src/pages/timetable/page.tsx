import {
  Badge,
  Box,
  Button,
  Center,
  CloseButton,
  createListCollection,
  Drawer,
  EmptyState,
  Heading,
  HStack,
  Portal,
  Select,
  Spinner,
  Stack,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { TimetableHook } from "@hooks/timetable.hooks";
import type { TimetableItem } from "@type/timetable.type";
import { memo, useMemo, useState } from "react";
import { LuCircleAlert } from "react-icons/lu";

const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const levelOptions = createListCollection({
  items: [
    { label: "All Levels", value: "" },
    { label: "L100", value: "L100" },
    { label: "L200", value: "L200" },
    { label: "L300", value: "L300" },
    { label: "L400", value: "L400" },
    { label: "L500", value: "L500" },
  ],
});

const semesterOptions = createListCollection({
  items: [
    { label: "All Semesters", value: "" },
    { label: "First Semester", value: "FIRST" },
    { label: "Second Semester", value: "SECOND" },
  ],
});

const Timetable = () => {
  const { data: timetables = [], isLoading, error } = TimetableHook.useTimetable();
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const filteredTimetables = useMemo(() => {
    let filtered = timetables;
    if (selectedLevel) {
      filtered = filtered.filter((t: TimetableItem) => t.level === selectedLevel);
    }
    if (selectedSemester) {
      filtered = filtered.filter((t: TimetableItem) => t.semester === selectedSemester);
    }
    return filtered;
  }, [timetables, selectedLevel, selectedSemester]);

  // Loading state – centered in full page
  if (isLoading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="accent.500" />
      </Center>
    );
  }

  // Error state – centered in full page
  if (error) {
    return (
      <Center minH="100vh">
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <LuCircleAlert />
            </EmptyState.Indicator>
            <VStack textAlign="center">
              <EmptyState.Title>Error</EmptyState.Title>
              <EmptyState.Description>
                {error.message}
              </EmptyState.Description>
            </VStack>
          </EmptyState.Content>
        </EmptyState.Root>
      </Center>
    );
  }

  return (
    <Stack gap="6">
      <Heading>Timetable</Heading>

      <Box bg="bg" rounded="md" p="4">
        <HStack gap="4" mb="4">
          <Select.Root
            collection={levelOptions}
            value={[selectedLevel]}
            onValueChange={(e) => setSelectedLevel(e.value[0])}
            size="sm"
            width="140px"
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select level" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {levelOptions.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          <Select.Root
            collection={semesterOptions}
            value={[selectedSemester]}
            onValueChange={(e) => setSelectedSemester(e.value[0])}
            size="sm"
            width="160px"
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select semester" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {semesterOptions.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </HStack>

        <Table.ScrollArea>
          <Table.Root size="sm" variant="outline">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Day</Table.ColumnHeader>
                <Table.ColumnHeader>Start Time</Table.ColumnHeader>
                <Table.ColumnHeader>End Time</Table.ColumnHeader>
                <Table.ColumnHeader>Venue</Table.ColumnHeader>
                <Table.ColumnHeader>Level</Table.ColumnHeader>
                <Table.ColumnHeader>Semester</Table.ColumnHeader>
                <Table.ColumnHeader>Session</Table.ColumnHeader>
                <Table.ColumnHeader>Course ID</Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredTimetables.map((item: TimetableItem) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.dayOfWeek}</Table.Cell>
                  <Table.Cell>{formatTime(item.startTime)}</Table.Cell>
                  <Table.Cell>{formatTime(item.endTime)}</Table.Cell>
                  <Table.Cell>{item.venue}</Table.Cell>
                  <Table.Cell>{item.level}</Table.Cell>
                  <Table.Cell>{item.semester}</Table.Cell>
                  <Table.Cell>{item.session}</Table.Cell>
                  <Table.Cell>{item.courseId}</Table.Cell>
                  <Table.Cell>
                    <DetailsDrawer item={item} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Box>
    </Stack>
  );
};

const DetailsDrawer = memo(({ item }: { item: TimetableItem }) => {
  return (
    <Drawer.Root size="md">
      <Drawer.Trigger asChild>
        <Button variant="outline" size="xs">
          View
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Timetable Details</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Stack gap="3">
                <HStack>
                  <Text fontWeight="bold">Course ID:</Text>
                  <Text>{item.courseId}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Day:</Text>
                  <Text>{item.dayOfWeek}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Time:</Text>
                  <Text>
                    {formatTime(item.startTime)} – {formatTime(item.endTime)}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Venue:</Text>
                  <Text>{item.venue}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Session:</Text>
                  <Text>{item.session}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Semester:</Text>
                  <Text>{item.semester}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Level:</Text>
                  <Text>{item.level}</Text>
                </HStack>
              </Stack>
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
});

export default Timetable;