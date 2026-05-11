import { useState, useEffect } from "react";
import { toaster } from "@components/ui/toaster";
import { Settings2, Calendar, Percent, ShieldCheck, Briefcase } from "lucide-react";
import { SystemServices } from "@services/system.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { systemSettingsSchema, type SystemSettingsData } from "@schemas/system.schema";
import { 
  Box, 
  Flex, 
  Text, 
  Input, 
  Button, 
  Field, 
  Stack, 
  Spinner,
  createListCollection,
  Select,
  Portal,
} from "@chakra-ui/react";
import { Switch } from "@components/ui/switch";
import { 
    DatePickerRoot, 
    DatePickerControl, 
    DatePickerInput, 
    DatePickerIndicatorGroup, 
    DatePickerTrigger, 
    DatePickerContent, 
    DatePickerView, 
    DatePickerHeader, 
    DatePickerDayTable, 
    DatePickerMonthTable, 
    DatePickerYearTable, 
    DatePickerPositioner
} from "@components/ui/date-picker";
import { parseDate } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";

const levelCollection = createListCollection({
  items: [
    { label: "100 Level", value: "L100" },
    { label: "200 Level", value: "L200" },
    { label: "300 Level", value: "L300" },
    { label: "400 Level", value: "L400" },
    { label: "500 Level", value: "L500" },
    { label: "600 Level", value: "L600" },
  ],
});

const SystemSettingsTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SystemSettingsData>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: {
      siwesRequired: true,
      caPercentage: 30,
      examPercentage: 70,
      probationCgpaThreshold: 1.0,
      suspensionThreshold: 2,
      siwesMinimumWeeks: 24,
      siwesLevel: "L300",
    }
  });

  const siwesRequired = watch("siwesRequired");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const data = await SystemServices.getSystemSettings();
      if (data) {
        reset({
          currentSession: data.currentSession,
          semester1StartDate: data.semester1StartDate ? parseDate(new Date(data.semester1StartDate).toISOString().split('T')[0]) : undefined,
          semester1EndDate: data.semester1EndDate ? parseDate(new Date(data.semester1EndDate).toISOString().split('T')[0]) : undefined,
          semester2StartDate: data.semester2StartDate ? parseDate(new Date(data.semester2StartDate).toISOString().split('T')[0]) : undefined,
          semester2EndDate: data.semester2EndDate ? parseDate(new Date(data.semester2EndDate).toISOString().split('T')[0]) : undefined,
          semester3StartDate: data.semester3StartDate ? parseDate(new Date(data.semester3StartDate).toISOString().split('T')[0]) : undefined,
          semester3EndDate: data.semester3EndDate ? parseDate(new Date(data.semester3EndDate).toISOString().split('T')[0]) : undefined,
          caPercentage: data.caPercentage,
          examPercentage: data.examPercentage,
          probationCgpaThreshold: Number(data.probationCgpaThreshold),
          suspensionThreshold: data.suspensionThreshold,
          siwesRequired: data.siwesRequired,
          siwesMinimumWeeks: data.siwesMinimumWeeks,
          siwesLevel: data.siwesLevel,
        });
      }
    } catch (err) {
      console.error("Failed to fetch system settings", err);
      // toaster.error({ title: "Failed to load system settings" });
      // Using mock data for now since API might not be ready
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: SystemSettingsData) => {
    try {
      setIsSaving(true);
      const payload = {
        ...data,
        semester1StartDate: data.semester1StartDate?.toString(),
        semester1EndDate: data.semester1EndDate?.toString(),
        semester2StartDate: data.semester2StartDate?.toString(),
        semester2EndDate: data.semester2EndDate?.toString(),
        semester3StartDate: data.semester3StartDate?.toString(),
        semester3EndDate: data.semester3EndDate?.toString(),
      };
      await SystemServices.updateSystemSettings(payload);
      toaster.success({ title: "System settings updated successfully" });
      setIsEditing(false);
      await fetchSettings();
    } catch (err) {
      console.error("Failed to update system settings", err);
      toaster.error({ title: "Failed to update system settings" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Flex justifyContent="center" py="20">
        <Spinner size="lg" color="blue.500" />
      </Flex>
    );
  }

  const DatePickerField = ({ label, valueName, error }: { label: string, valueName: keyof SystemSettingsData, error?: any }) => {
    const val = watch(valueName) as DateValue | undefined;
    return (
      <Field.Root invalid={!!error}>
        <Field.Label fontSize="sm" fontWeight="medium" color="slate.700" mb="2">{label}</Field.Label>
        <DatePickerRoot
          value={val ? [val] : []}
          onValueChange={(e) => setValue(valueName, e.value[0])}
          disabled={!isEditing}
          width="full"
        >
          <DatePickerControl>
            <DatePickerInput bg={isEditing ? "white" : "slate.50"} border="xs" borderColor="border.muted" borderRadius="lg" />
            <DatePickerIndicatorGroup>
              <DatePickerTrigger>
                <Calendar size={16} />
              </DatePickerTrigger>
            </DatePickerIndicatorGroup>
          </DatePickerControl>
          <Portal>
            <DatePickerPositioner>
              <DatePickerContent>
                <DatePickerView view="day">
                  <DatePickerHeader />
                  <DatePickerDayTable />
                </DatePickerView>
                <DatePickerView view="month">
                  <DatePickerHeader />
                  <DatePickerMonthTable />
                </DatePickerView>
                <DatePickerView view="year">
                  <DatePickerHeader />
                  <DatePickerYearTable />
                </DatePickerView>
              </DatePickerContent>
            </DatePickerPositioner>
          </Portal>
        </DatePickerRoot>
        {error && <Field.ErrorText>{error.message}</Field.ErrorText>}
      </Field.Root>
    );
  };

  return (
    <Box bg="white" borderRadius="2xl" border="xs" borderColor="border.muted" p={{ base: "6", md: "10" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex justifyContent="space-between" alignItems="center" mb="8">
          <Flex alignItems="center" gap="3">
            <Box p="2" bg="blue.50" borderRadius="lg">
              <Settings2 size={24} color="#1D7AD9" />
            </Box>
            <Box>
              <Text fontSize="xl" fontWeight="bold" color="slate.800">System Configuration</Text>
              <Text fontSize="sm" color="slate.500">Manage global academic parameters and policies</Text>
            </Box>
          </Flex>
          <Button
            type={isEditing ? "submit" : "button"}
            onClick={() => !isEditing && setIsEditing(true)}
            bg={isEditing ? "blue.600" : "slate.100"}
            color={isEditing ? "white" : "slate.600"}
            _hover={{ bg: isEditing ? "blue.700" : "slate.200" }}
            loading={isSaving}
          >
            {isEditing ? "Save Changes" : "Edit Configuration"}
          </Button>
        </Flex>

        <Stack gap="10">
          {/* Academic Session */}
          <Box>
            <Flex alignItems="center" gap="2" mb="4">
              <Calendar size={18} color="#1D7AD9" />
              <Text fontWeight="bold" fontSize="md" color="slate.700">Academic Session & Semesters</Text>
            </Flex>
            <Box bg="slate.50" p="6" borderRadius="xl" border="xs" borderColor="border.muted">
              <Stack gap="6">
                <Field.Root invalid={!!errors.currentSession}>
                  <Field.Label fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Current Session</Field.Label>
                  <Input
                    {...register("currentSession")}
                    placeholder="e.g. 2025/2026"
                    disabled={!isEditing}
                    bg={isEditing ? "white" : "transparent"}
                  />
                  <Field.ErrorText>{errors.currentSession?.message}</Field.ErrorText>
                </Field.Root>

                <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="6">
                  <DatePickerField label="Semester 1 Start Date" valueName="semester1StartDate" error={errors.semester1StartDate} />
                  <DatePickerField label="Semester 1 End Date" valueName="semester1EndDate" error={errors.semester1EndDate} />
                  <DatePickerField label="Semester 2 Start Date" valueName="semester2StartDate" error={errors.semester2StartDate} />
                  <DatePickerField label="Semester 2 End Date" valueName="semester2EndDate" error={errors.semester2EndDate} />
                  <DatePickerField label="Semester 3 Start Date (Optional)" valueName="semester3StartDate" error={errors.semester3StartDate} />
                  <DatePickerField label="Semester 3 End Date (Optional)" valueName="semester3EndDate" error={errors.semester3EndDate} />
                </Box>
              </Stack>
            </Box>
          </Box>

          {/* Grading & Progression */}
          <Box display="grid" gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="10">
            <Box>
              <Flex alignItems="center" gap="2" mb="4">
                <Percent size={18} color="#1D7AD9" />
                <Text fontWeight="bold" fontSize="md" color="slate.700">Grading Policy</Text>
              </Flex>
              <Box bg="slate.50" p="6" borderRadius="xl" border="xs" borderColor="border.muted">
                <Stack gap="6">
                  <Field.Root invalid={!!errors.caPercentage}>
                    <Field.Label fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Continuous Assessment (%)</Field.Label>
                    <Input
                      type="number"
                      {...register("caPercentage", { valueAsNumber: true })}
                      disabled={!isEditing}
                      bg={isEditing ? "white" : "transparent"}
                    />
                    <Field.ErrorText>{errors.caPercentage?.message}</Field.ErrorText>
                  </Field.Root>
                  <Field.Root invalid={!!errors.examPercentage}>
                    <Field.Label fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Examination (%)</Field.Label>
                    <Input
                      type="number"
                      {...register("examPercentage", { valueAsNumber: true })}
                      disabled={!isEditing}
                      bg={isEditing ? "white" : "transparent"}
                    />
                    <Field.ErrorText>{errors.examPercentage?.message}</Field.ErrorText>
                  </Field.Root>
                </Stack>
              </Box>
            </Box>

            <Box>
              <Flex alignItems="center" gap="2" mb="4">
                <ShieldCheck size={18} color="#1D7AD9" />
                <Text fontWeight="bold" fontSize="md" color="slate.700">Progression Thresholds</Text>
              </Flex>
              <Box bg="slate.50" p="6" borderRadius="xl" border="xs" borderColor="border.muted">
                <Stack gap="6">
                  <Field.Root invalid={!!errors.probationCgpaThreshold}>
                    <Field.Label fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Probation CGPA Threshold</Field.Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register("probationCgpaThreshold", { valueAsNumber: true })}
                      disabled={!isEditing}
                      bg={isEditing ? "white" : "transparent"}
                    />
                    <Field.ErrorText>{errors.probationCgpaThreshold?.message}</Field.ErrorText>
                  </Field.Root>
                  <Field.Root invalid={!!errors.suspensionThreshold}>
                    <Field.Label fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Suspension Threshold (Consecutive Probations)</Field.Label>
                    <Input
                      type="number"
                      {...register("suspensionThreshold", { valueAsNumber: true })}
                      disabled={!isEditing}
                      bg={isEditing ? "white" : "transparent"}
                    />
                    <Field.ErrorText>{errors.suspensionThreshold?.message}</Field.ErrorText>
                  </Field.Root>
                </Stack>
              </Box>
            </Box>
          </Box>

          {/* SIWES Settings */}
          <Box>
            <Flex alignItems="center" gap="2" mb="4">
              <Briefcase size={18} color="#1D7AD9" />
              <Text fontWeight="bold" fontSize="md" color="slate.700">SIWES Settings</Text>
            </Flex>
            <Box bg="slate.50" p="6" borderRadius="xl" border="xs" borderColor="border.muted">
              <Stack gap="6">
                <Flex alignItems="center" gap="3">
                   <Switch 
                    id="siwes-required" 
                    checked={siwesRequired} 
                    disabled={!isEditing}
                    onCheckedChange={(e: { checked: boolean }) => setValue("siwesRequired", e.checked)}
                   />
                   <Box>
                    <Text fontSize="sm" fontWeight="bold">SIWES Required</Text>
                    <Text fontSize="xs" color="slate.500">Enable or disable SIWES requirement for students</Text>
                   </Box>
                </Flex>

                <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="6">
                  <Field.Root invalid={!!errors.siwesMinimumWeeks}>
                    <Field.Label fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Minimum Weeks</Field.Label>
                    <Input
                      type="number"
                      {...register("siwesMinimumWeeks", { valueAsNumber: true })}
                      disabled={!isEditing || !siwesRequired}
                      bg={isEditing && siwesRequired ? "white" : "transparent"}
                    />
                    <Field.ErrorText>{errors.siwesMinimumWeeks?.message}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.siwesLevel}>
                    <Field.Label fontSize="sm" fontWeight="medium" color="slate.700" mb="2">SIWES Level</Field.Label>
                    <Select.Root
                      collection={levelCollection}
                      value={[watch("siwesLevel")]}
                      onValueChange={(e) => setValue("siwesLevel", e.value[0])}
                      disabled={!isEditing || !siwesRequired}
                      size="lg"
                    >
                      <Select.Trigger bg={isEditing && siwesRequired ? "white" : "transparent"}>
                        <Select.ValueText placeholder="Select Level" />
                      </Select.Trigger>
                      <Portal>
                        <Select.Positioner>
                          <Select.Content>
                            {levelCollection.items.map((item) => (
                              <Select.Item item={item} key={item.value}>
                                {item.label}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Portal>
                    </Select.Root>
                    <Field.ErrorText>{errors.siwesLevel?.message}</Field.ErrorText>
                  </Field.Root>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Stack>

        {isEditing && (
          <Flex justifyContent="flex-end" mt="10" gap="4">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                fetchSettings();
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              bg="blue.600"
              color="white"
              _hover={{ bg: "blue.700" }}
              loading={isSaving}
              loadingText="Saving..."
            >
              Save Changes
            </Button>
          </Flex>
        )}
      </form>
    </Box>
  );
};

export default SystemSettingsTab;
