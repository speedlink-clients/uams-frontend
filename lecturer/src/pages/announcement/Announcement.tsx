import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  Portal,
  DatePicker,
  Icon,
} from "@chakra-ui/react";
import type { DateValue } from "@internationalized/date";
import { LuCalendar } from "react-icons/lu";
import { AnnouncementHook } from "@hooks/announcement.hook";
import AnnouncementList from "@components/shared/AnnouncementList";

// Helper to convert any DateValue to YYYY-MM-DD string
const toDateString = (date: DateValue | null): string => {
  if (!date) return "";
  if ("year" in date && "month" in date && "day" in date) {
    return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
  }
  return "";
};

const Announcement = () => {
  const [fromDate, setFromDate] = useState<DateValue | null>(null);
  const [toDate, setToDate] = useState<DateValue | null>(null);

  const fromDateString = toDateString(fromDate);
  const toDateStringVal = toDateString(toDate);

  const {
    data: announcements = [],
    isLoading,
    error,
    refetch,
  } = AnnouncementHook.useAnnouncements(fromDateString || undefined, toDateStringVal || undefined);

  return (
    <Box p="8" maxW="1400px" mx="auto">
      <Flex align="center" justify="space-between" mb="8" flexWrap="wrap" gap="4">
        <Heading size="lg" fontWeight="700" color="#1e293b">
          Announcement
        </Heading>

        <Flex align="center" gap="3" flexWrap="wrap">
          <Text fontSize="xs" fontWeight="500" color="gray.500">From</Text>
          <DatePicker.Root
            value={fromDate ? [fromDate] : []}
            onValueChange={(e) => setFromDate(e.value[0] || null)}
            size="sm"
            width="160px"
          >
            <DatePicker.Control>
              <DatePicker.Input />
              <DatePicker.IndicatorGroup>
                <DatePicker.Trigger>
                  <Icon as={LuCalendar} />
                </DatePicker.Trigger>
              </DatePicker.IndicatorGroup>
            </DatePicker.Control>
            <Portal>
              <DatePicker.Positioner>
                <DatePicker.Content>
                  <DatePicker.View view="day">
                    <DatePicker.Header />
                    <DatePicker.DayTable />
                  </DatePicker.View>
                  <DatePicker.View view="month">
                    <DatePicker.Header />
                    <DatePicker.MonthTable />
                  </DatePicker.View>
                  <DatePicker.View view="year">
                    <DatePicker.Header />
                    <DatePicker.YearTable />
                  </DatePicker.View>
                </DatePicker.Content>
              </DatePicker.Positioner>
            </Portal>
          </DatePicker.Root>

          <Text fontSize="xs" fontWeight="500" color="gray.500">To</Text>
          <DatePicker.Root
            value={toDate ? [toDate] : []}
            onValueChange={(e) => setToDate(e.value[0] || null)}
            size="sm"
            width="160px"
          >
            <DatePicker.Control>
              <DatePicker.Input />
              <DatePicker.IndicatorGroup>
                <DatePicker.Trigger>
                  <Icon as={LuCalendar} />
                </DatePicker.Trigger>
              </DatePicker.IndicatorGroup>
            </DatePicker.Control>
            <Portal>
              <DatePicker.Positioner>
                <DatePicker.Content>
                  <DatePicker.View view="day">
                    <DatePicker.Header />
                    <DatePicker.DayTable />
                  </DatePicker.View>
                  <DatePicker.View view="month">
                    <DatePicker.Header />
                    <DatePicker.MonthTable />
                  </DatePicker.View>
                  <DatePicker.View view="year">
                    <DatePicker.Header />
                    <DatePicker.YearTable />
                  </DatePicker.View>
                </DatePicker.Content>
              </DatePicker.Positioner>
            </Portal>
          </DatePicker.Root>
        </Flex>
      </Flex>

      <AnnouncementList
        announcements={announcements}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
      />
    </Box>
  );
};

export default Announcement;