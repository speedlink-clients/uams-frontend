import { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { Box, Flex, Text, Spinner, Select, Portal, createListCollection, Button } from "@chakra-ui/react";
import useAuthStore from "@stores/auth.store";

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
    const [showPassword, setShowPassword] = useState(false);

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

    if (!isOpen) return null;

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "10px 14px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        fontSize: "14px",
        background: "white",
        outline: "none",
    };

    const inputStyleReadonly: React.CSSProperties = {
        ...inputStyle,
        background: "#f8fafc",
        color: "#64748b",
    };

    return (
        <Flex position="fixed" top="0" left="0" right="0" bottom="0" bg="blackAlpha.600" zIndex="9999" alignItems="center" justifyContent="center" p="4" backdropFilter="blur(4px)">
            <Box bg="white" borderRadius="2xl" shadow="xl" w="full" maxW="4xl" maxH="90vh" overflowY="auto">
                <Box p="8">
                    <Flex justifyContent="space-between" alignItems="center" mb="8">
                        <Text fontSize="2xl" fontWeight="bold" color="#1D7AD9">
                            {initialData ? "Edit Lecturer" : "Add Lecturer"}
                        </Text>
                        <Box as="button" onClick={onClose} p="2" _hover={{ bg: "slate.100" }} borderRadius="full" cursor="pointer" border="none" bg="transparent">
                            <X size={24} color="#94a3b8" />
                        </Box>
                    </Flex>

                    <Flex direction={{ base: "column", md: "row" }} gap="8" flexWrap="wrap">
                        {/* Staff ID */}
                        <Box w={{ base: "full", md: "calc(50% - 16px)" }}>
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Staff ID</Text>
                            <input value={formData.staffId} onChange={(e) => setFormData({ ...formData, staffId: e.target.value })} style={initialData ? inputStyleReadonly : inputStyle} />
                        </Box>

                        {/* Title */}
                        <Box w={{ base: "full", md: "calc(50% - 16px)" }}>
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Title</Text>
                            <input placeholder="E.g Dr, Mr etc" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={inputStyle} />
                        </Box>

                        {/* First Name */}
                        <Box w={{ base: "full", md: "calc(50% - 16px)" }}>
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">First Name</Text>
                            <input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} style={inputStyle} />
                        </Box>

                        {/* Other Name */}
                        <Box w={{ base: "full", md: "calc(50% - 16px)" }}>
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Other Name</Text>
                            <input value={formData.otherName} onChange={(e) => setFormData({ ...formData, otherName: e.target.value })} style={inputStyle} />
                        </Box>

                        {/* Sex - Select.Root */}
                        <Box w={{ base: "full", md: "calc(50% - 16px)" }}>
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Sex</Text>
                            <Select.Root
                                collection={sexCollection}
                                value={[formData.sex]}
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
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Highest Degree</Text>
                            <input placeholder="PhD" value={formData.highestDegree} onChange={(e) => setFormData({ ...formData, highestDegree: e.target.value })} style={inputStyle} />
                        </Box>

                        {/* Phone Number */}
                        <Box w={{ base: "full", md: "calc(50% - 16px)" }}>
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Phone Number</Text>
                            <input placeholder="Enter Phone Number" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} style={inputStyle} />
                        </Box>

                        {/* Email */}
                        <Box w={{ base: "full", md: "calc(50% - 16px)" }}>
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Email</Text>
                            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={inputStyle} />
                        </Box>

                        {/* Password */}
                        <Box w={{ base: "full", md: "calc(50% - 16px)" }}>
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Password</Text>
                            <Box position="relative">
                                <input type={showPassword ? "text" : "password"} placeholder="Use Phone Number as Default Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={{ ...inputStyle, paddingRight: "40px" }} />
                                <Box as="button" onClick={() => setShowPassword(!showPassword)} position="absolute" right="10px" top="50%" transform="translateY(-50%)" bg="transparent" border="none" cursor="pointer" color="slate.400" display="flex" alignItems="center" p="0" _hover={{ color: "slate.600" }}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </Box>
                            </Box>
                        </Box>

                        {/* Role */}
                        <Box w={{ base: "full", md: "calc(50% - 16px)" }}>
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Role</Text>
                            <Select.Root
                                collection={roleCollection}
                                value={[formData.role]}
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
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Category</Text>
                            <Select.Root
                                collection={categoryCollection}
                                value={[formData.category]}
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
                        <Button onClick={onClose} px="8" py="2.5" fontSize="sm" fontWeight="bold" color="slate.700" bg="white" border="1px solid" borderColor="slate.300" borderRadius="lg" cursor="pointer" _hover={{ bg: "slate.50" }}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} px="8" py="2.5" fontSize="sm" fontWeight="bold" color="white" bg="#1D7AD9" borderRadius="lg" cursor={isLoading ? "not-allowed" : "pointer"} opacity={isLoading ? 0.7 : 1} alignItems="center" gap="2">
                            {isLoading && <Spinner size="sm" />}
                            {initialData ? "Save Changes" : "Add Lecturer"}
                        </Button>
                    </Flex>
                </Box>
            </Box>
        </Flex>
    );
};

export default AddStaffForm;