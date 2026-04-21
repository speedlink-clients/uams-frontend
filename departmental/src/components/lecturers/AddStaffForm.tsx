import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Box, Flex, Text, Spinner } from "@chakra-ui/react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    initialData?: any;
}

const AddStaffForm = ({ isOpen, onClose, onSubmit, initialData }: Props) => {
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
                    {/* Header */}
                    <Flex justifyContent="space-between" alignItems="center" mb="8">
                        <Text fontSize="2xl" fontWeight="bold" color="#1D7AD9">
                            {initialData ? "Edit Lecturer" : "Add Lecturer"}
                        </Text>
                        <Box as="button" onClick={onClose} p="2" _hover={{ bg: "slate.100" }} borderRadius="full" cursor="pointer" border="none" bg="transparent">
                            <X size={24} color="#94a3b8" />
                        </Box>
                    </Flex>

                    {/* Form Grid */}
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

                        {/* Sex */}
                        <Box w={{ base: "full", md: "calc(50% - 16px)" }}>
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Sex</Text>
                            <select value={formData.sex} onChange={(e) => setFormData({ ...formData, sex: e.target.value })} style={inputStyle}>
                                <option value="">Select</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                            </select>
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
                            <input type="password" placeholder="Use Phone Number as Default Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={inputStyle} />
                        </Box>

                        {/* Role */}
                        <Box w={{ base: "full", md: "calc(50% - 16px)" }}>
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Role</Text>
                            <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={inputStyle}>
                                <option value="">Select</option>
                                <option value="LECTURER">Lecturer</option>
                                <option value="ERO">Exams and Record Officer</option>
                                <option value="HOD">HOD</option>
                            </select>
                        </Box>

                        {/* Category */}
                        <Box w={{ base: "full", md: "calc(50% - 16px)" }}>
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Category</Text>
                            <input placeholder="Professor" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={inputStyle} />
                        </Box>
                    </Flex>

                    {/* Footer */}
                    <Flex justifyContent="flex-end" gap="3" mt="8" pt="6">
                        <Box as="button" onClick={onClose} px="8" py="2.5" fontSize="sm" fontWeight="bold" color="slate.700" bg="white" border="1px solid" borderColor="slate.300" borderRadius="lg" cursor="pointer" _hover={{ bg: "slate.50" }}>
                            Cancel
                        </Box>
                        <Flex as="button" onClick={handleSubmit} px="8" py="2.5" fontSize="sm" fontWeight="bold" color="white" bg="#1D7AD9" borderRadius="lg" border="none" cursor={isLoading ? "not-allowed" : "pointer"} _hover={{ bg: "blue.700" }} boxShadow="lg" opacity={isLoading ? 0.7 : 1} alignItems="center" gap="2">
                            {isLoading && <Spinner size="sm" />}
                            {initialData ? "Save Changes" : "Add Lecturer"}
                        </Flex>
                    </Flex>
                </Box>
            </Box>
        </Flex>
    );
};

export default AddStaffForm;
