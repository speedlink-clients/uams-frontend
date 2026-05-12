import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Box, Flex, Text, Spinner, Select, Portal, createListCollection, Button, Dialog, Input } from "@chakra-ui/react";
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
        { label: "Select", value: "" },
        { label: "Male", value: "MALE" },
        { label: "Female", value: "FEMALE" },
    ],
});

const roleCollection = createListCollection({
    items: [
        { label: "Select", value: "" },
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
    items: [
        { label: "Select Category", value: "" },
        ...categoryOptions.map(opt => ({ label: capitalizeWords(opt), value: opt })),
    ],
});

const AddStaffForm = ({ isOpen, onClose, onSubmit, initialData }: Props) => {
    const { departmentId: authDepartmentId } = useAuthStore();
    const [formData, setFormData] = useState({
        staffId: "",
        title: "",
        firstName: "",
        otherName: "",
        sex: "",
        highestDegree: "",
        phoneNumber: "",
        email: "",
        password: "",
        role: "",
        category: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                staffId: initialData.staffId || initialData.staffNumber || "",
                title: initialData.title || "",
                firstName: initialData.firstname || initialData.firstName || initialData.fullName?.split(" ")[0] || "",
                otherName: initialData.othername || initialData.otherName || initialData.fullName?.split(" ").slice(1).join(" ") || "",
                sex: initialData.sex || "",
                highestDegree: initialData.highestDegree || initialData.level || "",
                phoneNumber: initialData.phoneNumber || initialData.phone || "",
                email: initialData.email || "",
                password: "",
                role: initialData.role || "",
                category: initialData.category || "",
            });
        } else {
            setFormData({
                staffId: "", title: "", firstName: "", otherName: "", sex: "",
                highestDegree: "", phoneNumber: "", email: "", password: "", role: "", category: "",
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async () => {
        if (!authDepartmentId && !initialData) {
            alert("Unable to determine department. Please contact support.");
            return;
        }

        setIsLoading(true);
        const payload = {
            staffId: formData.staffId,
            title: formData.title,
            firstname: formData.firstName,
            othername: formData.otherName,
            sex: formData.sex.toUpperCase(),
            highestDegree: formData.highestDegree,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            role: formData.role,
            category: formData.category,
            departmentId: authDepartmentId,
            ...(formData.password ? { password: formData.password } : (!initialData ? { password: formData.phoneNumber } : {})),
        };
        try {
            await onSubmit(payload);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => { if (!e.open) onClose() }}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content bg="white" borderRadius="2xl" maxW="4xl" p="8">
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

                    <Flex direction={{ base: "column", md: "row" }} gap="8" flexWrap="wrap">
                        {/* Staff ID */}
                        <Box w={{ base: "full", md: "calc(50% - 16px)" }}>
                            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Staff ID</Text>
                            <Input value={formData.staffId} onChange={(e) => setFormData({ ...formData, staffId: e.target.value })} readOnly={!!initialData} bg={initialData ? "slate.50" : "white"} color={initialData ? "fg.muted" : "inherit"} />
                        </Box>

                        {/* Title */}
                        <Box w={{ base: "full", md: "calc(50% - 16px)" }}>
                            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Title</Text>
                            <Input placeholder="E.g Dr, Mr etc" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} bg="white" />
                        </Box>

                        {/* First Name */}
                        <Box w={{ base: "full", md: "calc(50% - 16px)" }}>
                            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">First Name</Text>
                            <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} bg="white" />
                        </Box>

                        {/* Other Name */}
                        <Box w={{ base: "full", md: "calc(50% - 16px)" }}>
                            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Other Name</Text>
                            <Input value={formData.otherName} onChange={(e) => setFormData({ ...formData, otherName: e.target.value })} bg="white" />
                        </Box>

                        {/* Sex - Select.Root */}
                        <Box w={{ base: "full", md: "calc(50% - 16px)" }}>
                            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Sex</Text>
                            <Select.Root
                                collection={sexCollection}
                                value={formData.sex ? [formData.sex] : []}
                                onValueChange={(e) => setFormData({ ...formData, sex: e.value[0] })}
                            >
                                <Select.HiddenSelect />
                                <Select.Control>
                                    <Select.Trigger>
                                        <Select.ValueText placeholder="Select" />
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
                        </Box>

                        {/* Highest Degree */}
                        <Box w={{ base: "full", md: "calc(50% - 16px)" }}>
                            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Highest Degree</Text>
                            <Input placeholder="PhD" value={formData.highestDegree} onChange={(e) => setFormData({ ...formData, highestDegree: e.target.value })} bg="white" />
                        </Box>

                        {/* Phone Number */}
                        <Box w={{ base: "full", md: "calc(50% - 16px)" }}>
                            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Phone Number</Text>
                            <Input placeholder="Enter Phone Number" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} bg="white" />
                        </Box>

                        {/* Email */}
                        <Box w={{ base: "full", md: "calc(50% - 16px)" }}>
                            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Email</Text>
                            <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} bg="white" />
                        </Box>

                        {/* Password */}
                        <Box w={{ base: "full", md: "calc(50% - 16px)" }}>
                            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Password</Text>
                            <PasswordInput placeholder="Use Phone Number as Default Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} bg="white" />
                        </Box>

                        {/* Role */}
                        <Box w={{ base: "full", md: "calc(50% - 16px)" }}>
                            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Role</Text>
                            <Select.Root
                                collection={roleCollection}
                                value={formData.role ? [formData.role] : []}
                                onValueChange={(e) => setFormData({ ...formData, role: e.value[0] })}
                            >
                                <Select.HiddenSelect />
                                <Select.Control>
                                    <Select.Trigger>
                                        <Select.ValueText placeholder="Select Role" />
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
                        </Box>

                        {/* Category */}
                        <Box w={{ base: "full", md: "calc(50% - 16px)" }}>
                            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Category</Text>
                            <Select.Root
                                collection={categoryCollection}
                                value={formData.category ? [formData.category] : []}
                                onValueChange={(e) => setFormData({ ...formData, category: e.value[0] })}
                            >
                                <Select.HiddenSelect />
                                <Select.Control>
                                    <Select.Trigger>
                                        <Select.ValueText placeholder="Select Category" />
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
                        </Box>
                    </Flex>

                    <Flex justifyContent="flex-end" gap="3" mt="8" pt="6">
                        <Button onClick={onClose} px="8" py="2.5" fontSize="sm" fontWeight="bold" color="fg.muted" bg="white" border="xs" borderColor="border.muted" borderRadius="lg" cursor="pointer" _hover={{ bg: "slate.50" }}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} px="8" py="2.5" fontSize="sm" fontWeight="bold" color="white" bg="#1D7AD9" borderRadius="lg" cursor={isLoading ? "not-allowed" : "pointer"} opacity={isLoading ? 0.7 : 1} alignItems="center" gap="2">
                            {isLoading && <Spinner size="sm" />}
                            {initialData ? "Save Changes" : "Add Lecturer"}
                        </Button>
                    </Flex>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};

export default AddStaffForm;