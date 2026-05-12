// components/shared/TimetablePanel.tsx
import {
  Box,
  Flex,
  Text,
  Icon,
  Spinner,
  Center,
  EmptyState,
  VStack,
  Select,
  Portal,
  createListCollection,
} from "@chakra-ui/react";
import { Clock } from "lucide-react";
import { TimetableHook } from "@hooks/timetable.hooks";
import useAuthStore from "@stores/auth.store";
import { useMemo } from "react";
import { LuCircleAlert } from "react-icons/lu";

interface TimetablePanelProps {
  selectedFilter: "today" | "tomorrow" | "week";
  onFilterChange: (value: "today" | "tomorrow" | "week") => void;
}

// Create collection for filter options
const filterCollection = createListCollection({
  items: [
    { label: "Today", value: "today" },
    { label: "Tomorrow", value: "tomorrow" },
    { label: "This Week", value: "week" },
  ],
});

const getCurrentDay = (): string => {
  const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  return days[new Date().getDay()];
};

const getNextDay = (): string => {
  const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  const tomorrowIndex = (new Date().getDay() + 1) % 7;
  return days[tomorrowIndex];
};

const getRemainingWeekDays = (): string[] => {
  const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  const todayIndex = new Date().getDay() - 1;
  if (todayIndex < 0) return [...days];
  return [...days.slice(todayIndex), ...days.slice(0, todayIndex)];
};

const TimetablePanel = ({ selectedFilter, onFilterChange }: TimetablePanelProps) => {
  const { user } = useAuthStore();
  const session = user?.currentSession;
  const semester = user?.currentSemester;

  const { data: timetableData = [], isLoading, error } = TimetableHook.useTimetable({ session, semester });

  const filteredEntries = useMemo(() => {
    if (!timetableData.length) return [];

    const currentDay = getCurrentDay();
    const nextDay = getNextDay();
    const weekDays = getRemainingWeekDays();

    switch (selectedFilter) {
      case "today":
        return timetableData.filter(entry => entry.dayOfWeek === currentDay);
      case "tomorrow":
        return timetableData.filter(entry => entry.dayOfWeek === nextDay);
      case "week":
        return timetableData.filter(entry => weekDays.includes(entry.dayOfWeek));
      default:
        return timetableData;
    }
  }, [timetableData, selectedFilter]);

  const sortedEntries = [...filteredEntries].sort((a, b) => a.startTime.localeCompare(b.startTime));

  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size="lg" color="accent.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <LuCircleAlert />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>Error loading timetable</EmptyState.Title>
            <EmptyState.Description>{error.message}</EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    );
  }

  return (
    <Box>
      <Flex align="center" justify="space-between" px="5" py="4.5" borderBottom="1px solid" borderColor="gray.50">
        <Text fontSize="md" fontWeight="600" color="gray.800">
          Timetable
        </Text>
        <Select.Root
          collection={filterCollection}
          value={[selectedFilter]}
          onValueChange={(e) => onFilterChange(e.value[0] as "today" | "tomorrow" | "week")}
          size="sm"
          width="120px"
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Select filter" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {filterCollection.items.map((item) => (
                  <Select.Item item={item} key={item.value}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </Flex>

      <Box flex="1" overflowY="auto" px="5" py="5">
        {sortedEntries.length > 0 ? (
          <Flex direction="column" gap="3">
            {sortedEntries.map((entry) => {
              const now = new Date();
              const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
              const isActive =
                selectedFilter === "today" &&
                entry.startTime.slice(11, 16) <= currentTime &&
                entry.endTime.slice(11, 16) >= currentTime;
              return (
                <Box
                  key={entry.id}
                  bg={isActive ? "accent.500" : "gray.50"}
                  color={isActive ? "white" : "gray.800"}
                  borderRadius="lg"
                  px="4.5"
                  py="4"
                  borderLeft="4px solid"
                  borderLeftColor={isActive ? "accent.600" : "gray.200"}
                >
                  <Text fontSize="14px" fontWeight="600" mb="1.5">
                    {entry.courseId}
                  </Text>
                  <Flex align="center" gap="3.5">
                    <Text fontSize="11px" opacity={isActive ? 0.9 : 0.6}>
                      {entry.venue}
                    </Text>
                    <Flex align="center" gap="1.5">
                      <Icon as={Clock} boxSize="3" />
                      <Text fontSize="11px">
                        {entry.startTime.slice(11, 16)} - {entry.endTime.slice(11, 16)}
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              );
            })}
          </Flex>
        ) : (
          <Flex h="full" direction="column" align="center" justify="center" textAlign="center" py="10">
            <Icon as={Clock} boxSize="8" color="gray.200" mb="3" />
            <Text fontSize="13px" fontWeight="500" color="gray.500">
              No classes scheduled for{" "}
              {selectedFilter === "today"
                ? "today"
                : selectedFilter === "tomorrow"
                ? "tomorrow"
                : "the week"}
            </Text>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default TimetablePanel;