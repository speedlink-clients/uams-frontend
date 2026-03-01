import { Badge, Box, Button, CloseButton, createListCollection, Drawer, Heading, HStack, Portal, Select, Stack, Table, Text, Wrap } from "@chakra-ui/react";
import { TimetableHook } from "@hooks/timetable.hooks";
import type { TimetableItem } from "@type/timetable.type";
import { memo, useMemo, useState } from "react";

const TimeTable = () => {
    const { data: timetables, isLoading, error } = TimetableHook.useTimetable();
    const [selectedLevel, setSelectedLevel] = useState(levels.items[0].value);

    const filterTimetables = useMemo(() => {
        return !selectedLevel ? timetables : timetables?.filter((timetable) => timetable.level.name === selectedLevel);
    }, [timetables, selectedLevel]);

    if (isLoading) return <Text>Loading...</Text>
    if (error) return <Text>Error: {error.message}</Text>



    return (
        <Stack gap="6">
            <Heading>Timetable</Heading>

            <Box
                bg="bg"
                rounded="md"
                p="4"
                spaceY="4"
            >

                <Select.Root onSelect={(e) => setSelectedLevel(e.value)} defaultValue={[levels.items[0].value]} collection={levels} size="sm" w="32">
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
                                {levels.items.map((level) => (
                                    <Select.Item item={level} key={level.value}>
                                        {level.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>

                <Table.ScrollArea>
                    <Table.Root size="sm" variant="outline">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader minW="100px">Session</Table.ColumnHeader>
                                <Table.ColumnHeader minW="100px">Level</Table.ColumnHeader>
                                <Table.ColumnHeader minW="100px">Semeter</Table.ColumnHeader>
                                <Table.ColumnHeader minW="100px"></Table.ColumnHeader>

                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {filterTimetables?.map((item) => (
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item?.session?.name}</Table.Cell>
                                    <Table.Cell>{item?.level?.name}</Table.Cell>
                                    <Table.Cell >{item.semester?.name}</Table.Cell>
                                    <Table.Cell >
                                        <ScheduleDrawer item={item} />
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Table.ScrollArea>
            </Box>


        </Stack>
    )
}

const levels = createListCollection({
    items: [
        { label: "All levels", value: "" },
        { label: "100", value: "100" },
        { label: "200", value: "200" },
        { label: "300", value: "300" },
        { label: "400", value: "400" },
        { label: "500", value: "500" },
    ],
})


export default TimeTable;



const ScheduleDrawer = memo(({ item }: { item: TimetableItem }) => {
    // Days of the week in order
    const daysOfWeek = [
        { key: 'monday', label: 'Monday' },
        { key: 'tuesday', label: 'Tuesday' },
        { key: 'wednesday', label: 'Wednesday' },
        { key: 'thursday', label: 'Thursday' },
        { key: 'friday', label: 'Friday' },
        { key: 'saturday', label: 'Saturday' },
        { key: 'sunday', label: 'Sunday' }
    ];

    // Get all unique time slots across all days
    const getAllTimeSlots = () => {
        const timeSlots = new Set();

        if (item?.schedule) {
            Object.values(item.schedule).forEach(dayEntries => {
                if (Array.isArray(dayEntries)) {
                    dayEntries.forEach(entry => {
                        timeSlots.add(`${entry.startTime} - ${entry.endTime}`);
                    });
                }
            });
        }

        // Sort time slots by start time
        return Array.from(timeSlots).sort((a, b) => {
            const timeA = (a as string).split(' - ')[0];
            const timeB = (b as string).split(' - ')[0];
            return timeA.localeCompare(timeB);
        });
    };

    // Get course for a specific day and time
    const getCourseForTimeSlot = (dayKey: string, timeSlot: string) => {
        const [startTime, endTime] = timeSlot.split(' - ');

        if (item?.schedule && dayKey in item.schedule && Array.isArray(item.schedule[dayKey as keyof typeof item.schedule])) {
            const entry = item.schedule[dayKey as keyof typeof item.schedule]?.find(
                e => e.startTime === startTime && e.endTime === endTime
            );
            return entry?.courseCode || '';
        }
        return '';
    };

    const timeSlots = getAllTimeSlots();

    return (
        <Drawer.Root size="xl">
            <Drawer.Trigger asChild>
                <Button variant="surface" size="xs">
                    View
                </Button>
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header>
                            <Drawer.Title>Timetable - {item?.title}</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            {/* Info badges */}
                            <Wrap mb={6}>
                                <Badge colorPalette="blue">{item?.programme?.name}</Badge>
                                <Badge colorPalette="green">Level {item?.level?.name}</Badge>
                                <Badge colorPalette="purple">{item?.semester?.name}</Badge>
                                <Badge colorPalette="orange">Session: {item?.session?.name}</Badge>
                            </Wrap>

                            {/* Timetable Table */}
                            {timeSlots.length > 0 ? (
                                <Box overflowX="auto" borderWidth="1px" borderRadius="md">
                                    <Table.Root size="sm" variant="outline" striped>
                                        <Table.Header>
                                            <Table.Row bg="gray.50">
                                                <Table.ColumnHeader
                                                    minW="150px"
                                                    bg="gray.100"
                                                    position="sticky"
                                                    left="0"
                                                    zIndex="1"
                                                >
                                                    Time
                                                </Table.ColumnHeader>
                                                {daysOfWeek.map(day => (
                                                    <Table.ColumnHeader
                                                        key={day.key}
                                                        minW="180px"
                                                        textAlign="center"
                                                        bg="gray.50"
                                                        textTransform="capitalize"
                                                    >
                                                        {day.label}
                                                    </Table.ColumnHeader>
                                                ))}
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {timeSlots.map((timeSlot, index) => (
                                                <Table.Row key={index}>
                                                    <Table.Cell
                                                        fontWeight="medium"
                                                        bg="gray.50"
                                                        position="sticky"
                                                        left="0"
                                                        zIndex="1"
                                                    >
                                                        {timeSlot as string}
                                                    </Table.Cell>
                                                    {daysOfWeek.map(day => {
                                                        const courseCode = getCourseForTimeSlot(day.key, timeSlot as string);
                                                        return (
                                                            <Table.Cell
                                                                key={day.key}
                                                                textAlign="center"
                                                                bg={courseCode ? 'blue.50' : 'white'}
                                                            >
                                                                {courseCode ? (
                                                                    <Badge
                                                                        colorPalette="blue"
                                                                        variant="subtle"
                                                                        fontSize="xs"
                                                                        p={1}
                                                                    >
                                                                        {courseCode}
                                                                    </Badge>
                                                                ) : (
                                                                    <Text color="gray.400" fontSize="xs">—</Text>
                                                                )}
                                                            </Table.Cell>
                                                        );
                                                    })}
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table.Root>
                                </Box>
                            ) : (
                                <Box textAlign="center" py={10} color="gray.500">
                                    No schedule available for this timetable
                                </Box>
                            )}

                            {/* Legend */}
                            <HStack mt={4} gap={4} fontSize="sm" color="gray.600">
                                <HStack>
                                    <Box w="12px" h="12px" bg="blue.50" borderWidth="1px" />
                                    <Text>Course scheduled</Text>
                                </HStack>
                                <HStack>
                                    <Box w="12px" h="12px" bg="white" borderWidth="1px" />
                                    <Text>No course</Text>
                                </HStack>
                            </HStack>
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

