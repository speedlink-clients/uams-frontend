import { useEffect } from "react";
import { X } from "lucide-react";
import { 
    Box, 
    Flex, 
    Text, 
    Spinner, 
    Select, 
    Portal, 
    createListCollection, 
    Button, 
    Dialog, 
    Input, 
    Field 
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StaffSchema, type StaffFormData } from "@schemas/staff.schema";
import useAuthStore from "@stores/auth.store";
import { PasswordInput } from "@components/ui/password-input";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    initialData?: any;
}

// Helper function 
const capitalizeWords = (str: string) => {
    return str.split(' ').map(word => {
        if (/^[IVXLCDM]+$/i.test(word)) {
            return word.toUpperCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
};

// Create collections for Select.Root
const sexCollection = createListCollection({
    items: [
        { label: "Male", value: "MALE" },
        { label: "Female", value: "FEMALE" },
    ],
});

const roleCollection = createListCollection({
    items: [
        { label: "LECTURER", value: "LECTURER" },
        { label: "ERO", value: "ERO" },
        { label: "HOD", value: "HOD" },
    ],
});

const categoryOptions = [
    "Professor",
    "Senior Lecturer",
    "Lecturer II",
    "Graduate Assistant",
    "Associate Professor"
];

const categoryCollection = createListCollection({
    items: categoryOptions.map(opt => ({ label: capitalizeWords(opt), value: opt })),
});

const AddStaffForm = ({ isOpen, onClose, onSubmit, initialData }: Props) => {
    const { departmentId: authDepartmentId, user } = useAuthStore();
    
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<StaffFormData>({
        resolver: zodResolver(StaffSchema) as any,
        defaultValues: {
            staffNumber: "",
            title: "",
            firstName: "",
            surname: "",
            otherName: "",
            gender: "",
            highestDegree: "",
            phone: "",
            email: "",
            password: "",
            staffRoles: [],
            category: "",
            faculty: "",
            department: "",
        }
    });

    useEffect(() => {
        if (initialData) {
            reset({
                staffNumber: initialData.staffNumber || initialData.staffId || "",
                title: initialData.title || "",
                firstName: initialData.firstName || initialData.firstname || "",
                surname: initialData.surname || "",
                otherName: initialData.otherName || initialData.othername || "",
                gender: initialData.gender || initialData.sex || "",
                highestDegree: initialData.highestDegree || "",
                phone: initialData.phone || initialData.phoneNumber || "",
                email: initialData.email || "",
                password: "",
                staffRoles: initialData.staffRoles || [],
                category: initialData.category || "",
                faculty: initialData.faculty || (user as any)?.staffProfile?.faculty || "",
                department: initialData.department || (user as any)?.staffProfile?.department || "",
            });
        } else {
            reset({
                staffNumber: "",
                title: "",
                firstName: "",
                surname: "",
                otherName: "",
                gender: "",
                highestDegree: "",
                phone: "",
                email: "",
                password: "",
                staffRoles: [],
                category: "",
                faculty: (user as any)?.staffProfile?.faculty || "",
                department: (user as any)?.staffProfile?.department || "",
            });
        }
    }, [initialData, reset, isOpen, user]);

    const onFormSubmit = async (data: StaffFormData) => {
        const payload = {
            ...data,
            type: "STAFF",
            departmentId: authDepartmentId,
            ...(data.password ? {} : (!initialData ? { password: data.phone } : {})),
        };
        try {
            await onSubmit(payload);
            onClose();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => { if (!e.open) onClose() }}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content bg="white" borderRadius="md" maxW="4xl" p="8">
                    <Flex justifyContent="space-between" alignItems="center" mb="8">
                        <Text fontSize="2xl" fontWeight="bold" color="#1D7AD9">
                            {initialData ? "Edit Lecturer" : "Add Lecturer"}
                        </Text>
                        <Dialog.CloseTrigger asChild>
                            <Box as="button" p="2" _hover={{ bg: "fg.subtle" }} borderRadius="full" cursor="pointer" border="none" bg="transparent">
                                <X size={24} color="#94a3b8" />
                            </Box>
                        </Dialog.CloseTrigger>
                    </Flex>

                    <form onSubmit={handleSubmit(onFormSubmit as any)}>
                        <Flex direction={{ base: "column", md: "row" }} gap="8" flexWrap="wrap">
                            <Field.Root w={{ base: "full", md: "calc(50% - 16px)" }} invalid={!!errors.staffNumber}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Staff ID</Field.Label>
                                <Input size="xl" {...register("staffNumber")} readOnly={!!initialData} bg={initialData ? "slate.50" : "white"} color={initialData ? "fg.muted" : "inherit"} border="xs" borderColor="border.muted" />
                                <Field.ErrorText>{errors.staffNumber?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root w={{ base: "full", md: "calc(50% - 16px)" }} invalid={!!errors.title}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Title</Field.Label>
                                <Input size="xl" placeholder="E.g Dr, Mr etc" {...register("title")} bg="white" border="xs" borderColor="border.muted" />
                                <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root w={{ base: "full", md: "calc(33.33% - 16px)" }} invalid={!!errors.firstName}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">First Name</Field.Label>
                                <Input size="xl" {...register("firstName")} bg="white" border="xs" borderColor="border.muted" />
                                <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root w={{ base: "full", md: "calc(33.33% - 16px)" }} invalid={!!errors.surname}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Surname</Field.Label>
                                <Input size="xl" {...register("surname")} bg="white" border="xs" borderColor="border.muted" />
                                <Field.ErrorText>{errors.surname?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root w={{ base: "full", md: "calc(33.33% - 16px)" }} invalid={!!errors.otherName}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Other Name</Field.Label>
                                <Input size="xl" {...register("otherName")} bg="white" border="xs" borderColor="border.muted" />
                                <Field.ErrorText>{errors.otherName?.message}</Field.ErrorText>
                            </Field.Root>

                            <Controller
                                name="gender"
                                control={control}
                                render={({ field }) => (
                                    <Field.Root w={{ base: "full", md: "calc(50% - 16px)" }} invalid={!!errors.gender}>
                                        <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Sex</Field.Label>
                                        <Select.Root
                                            collection={sexCollection}
                                            value={field.value ? [field.value] : []}
                                            onValueChange={(e) => field.onChange(e.value[0])}
                                            size="lg"
                                        >
                                            <Select.HiddenSelect />
                                            <Select.Control>
                                                <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                                                    <Select.ValueText placeholder="Select" color="fg.muted" />
                                                </Select.Trigger>
                                                <Select.IndicatorGroup>
                                                    <Select.Indicator />
                                                </Select.IndicatorGroup>
                                            </Select.Control>
                                            <Portal>
                                                <Select.Positioner>
                                                    <Select.Content>
                                                        {sexCollection.items.map((item) => (
                                                            <Select.Item key={item.value} item={item}>
                                                                {item.label}
                                                            </Select.Item>
                                                        ))}
                                                    </Select.Content>
                                                </Select.Positioner>
                                            </Portal>
                                        </Select.Root>
                                        <Field.ErrorText>{errors.gender?.message}</Field.ErrorText>
                                    </Field.Root>
                                )}
                            />

                            <Field.Root w={{ base: "full", md: "calc(50% - 16px)" }} invalid={!!errors.highestDegree}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Highest Degree</Field.Label>
                                <Input size="xl" placeholder="PhD" {...register("highestDegree")} bg="white" border="xs" borderColor="border.muted" />
                                <Field.ErrorText>{errors.highestDegree?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root w={{ base: "full", md: "calc(50% - 16px)" }} invalid={!!errors.phone}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Phone Number</Field.Label>
                                <Input size="xl" placeholder="Enter Phone Number" {...register("phone")} bg="white" border="xs" borderColor="border.muted" />
                                <Field.ErrorText>{errors.phone?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root w={{ base: "full", md: "calc(50% - 16px)" }} invalid={!!errors.email}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Email</Field.Label>
                                <Input size="xl" type="email" {...register("email")} bg="white" border="xs" borderColor="border.muted" />
                                <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root w={{ base: "full", md: "calc(50% - 16px)" }} invalid={!!errors.password}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Password</Field.Label>
                                <PasswordInput size="xl" placeholder="Use Phone Number as Default Password" {...register("password")} bg="white" />
                                <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                            </Field.Root>

                            <Controller
                                name="staffRoles"
                                control={control}
                                render={({ field }) => (
                                    <Field.Root w={{ base: "full", md: "calc(50% - 16px)" }} invalid={!!errors.staffRoles}>
                                        <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Role</Field.Label>
                                        <Select.Root
                                            multiple
                                            collection={roleCollection}
                                            value={field.value}
                                            onValueChange={(e) => field.onChange(e.value)}
                                            size="lg"
                                        >
                                            <Select.HiddenSelect />
                                            <Select.Control>
                                                <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                                                    <Select.ValueText placeholder="Select Roles" color="fg.muted" />
                                                </Select.Trigger>
                                                <Select.IndicatorGroup>
                                                    <Select.Indicator />
                                                </Select.IndicatorGroup>
                                            </Select.Control>
                                            <Portal>
                                                <Select.Positioner>
                                                    <Select.Content>
                                                        {roleCollection.items.map((item) => (
                                                            <Select.Item key={item.value} item={item}>
                                                                {item.label}
                                                            </Select.Item>
                                                        ))}
                                                    </Select.Content>
                                                </Select.Positioner>
                                            </Portal>
                                        </Select.Root>
                                        <Field.ErrorText>{errors.staffRoles?.message}</Field.ErrorText>
                                    </Field.Root>
                                )}
                            />

                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Field.Root w={{ base: "full", md: "calc(50% - 16px)" }} invalid={!!errors.category}>
                                        <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Category</Field.Label>
                                        <Select.Root
                                            collection={categoryCollection}
                                            value={field.value ? [field.value] : []}
                                            onValueChange={(e) => field.onChange(e.value[0])}
                                            size="lg"
                                        >
                                            <Select.HiddenSelect />
                                            <Select.Control>
                                                <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                                                    <Select.ValueText placeholder="Select Category" color="fg.muted" />
                                                </Select.Trigger>
                                                <Select.IndicatorGroup>
                                                    <Select.Indicator />
                                                </Select.IndicatorGroup>
                                            </Select.Control>
                                            <Portal>
                                                <Select.Positioner>
                                                    <Select.Content>
                                                        {categoryCollection.items.map((item) => (
                                                            <Select.Item key={item.value} item={item}>
                                                                {item.label}
                                                            </Select.Item>
                                                        ))}
                                                    </Select.Content>
                                                </Select.Positioner>
                                            </Portal>
                                        </Select.Root>
                                        <Field.ErrorText>{errors.category?.message}</Field.ErrorText>
                                    </Field.Root>
                                )}
                            />
                        </Flex>

                        <Flex justifyContent="flex-end" gap="3" mt="8" pt="6">
                            <Button type="button" onClick={onClose} px="8" py="2.5" fontSize="sm" fontWeight="bold" color="fg.muted" bg="white" border="xs" borderColor="border.muted" borderRadius="md" cursor="pointer" _hover={{ bg: "slate.50" }}>
                                Cancel
                            </Button>
                            <Button type="submit" px="8" py="2.5" fontSize="sm" fontWeight="bold" color="white" bg="#1D7AD9" borderRadius="md" cursor={isSubmitting ? "not-allowed" : "pointer"} opacity={isSubmitting ? 0.7 : 1} alignItems="center" gap="2">
                                {isSubmitting && <Spinner size="sm" />}
                                {initialData ? "Save Changes" : "Add Lecturer"}
                            </Button>
                        </Flex>
                    </form>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};

export default AddStaffForm;