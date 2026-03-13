import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { StudentServices } from "@services/student.service";
import Select from "react-select";
import { Box, Flex, Text, Spinner } from "@chakra-ui/react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (data: { studentId: string; level?: string }) => Promise<void>;
    staffName?: string;
}

interface StudentOption {
    value: string;
    label: string;
    email?: string;
    level?: string;
}

const AssignStudentModal = ({ isOpen, onClose, onAssign, staffName }: Props) => {
    const [studentId, setStudentId] = useState("");
    const [level, setLevel] = useState("");
    const [students, setStudents] = useState<any[]>([]);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Map students to options format
    const studentOptions: StudentOption[] = students.map((s: any) => ({
        value: s.id,
        label: s.matricNumber ? `${s.matricNumber} - ${s.name || s.fullName || ""}` : s.name || s.fullName || "",
        email: s.email,
        level: s.level,
    }));

    const levelOptions = [
        { value: "100", label: "100 Level" },
        { value: "200", label: "200 Level" },
        { value: "300", label: "300 Level" },
        { value: "400", label: "400 Level" },
        { value: "500", label: "500 Level" },
    ];

    useEffect(() => {
        if (isOpen) {
            setStudentId("");
            setLevel("");
            fetchStudents();
        }
    }, [isOpen]);

    const fetchStudents = async () => {
        try {
            setIsLoadingStudents(true);
            
            const response = await StudentServices.getStudents(1, 100);
            console.log("Students response:", response);
            
    
            const list = response?.data || (Array.isArray(response) ? response : []);
            setStudents(list);
        } catch (err) {
            console.error("Failed to fetch students:", err);
        } finally {
            setIsLoadingStudents(false);
        }
    };

    const handleSubmit = async () => {
        if (!studentId) return;
        setIsSubmitting(true);
        try {
            await onAssign({ 
                studentId, 
                ...(level && { level }), 
            });
            onClose();
        } catch (err) {
            console.error("Failed to assign student:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Flex position="fixed" top="0" left="0" right="0" bottom="0" bg="blackAlpha.600" zIndex="9999" alignItems="center" justifyContent="center" p="4" backdropFilter="blur(4px)">
            <Box bg="white" borderRadius="2xl" shadow="2xl" w="full" maxW="lg" overflow="hidden">
                {/* Header */}
                <Flex p="6" borderBottom="1px solid" borderColor="gray.100" alignItems="center" justifyContent="space-between">
                    <Text fontSize="xl" fontWeight="bold" color="#1D7AD9">Assign Student to Lecturer</Text>
                    <Box as="button" onClick={onClose} p="2" _hover={{ bg: "slate.50" }} borderRadius="full" color="slate.400" cursor="pointer" border="none" bg="transparent">
                        <X size={20} />
                    </Box>
                </Flex>

                {/* Body */}
                <Box p="6">
                    <Flex direction="column" gap="6">
                        {staffName && (
                            <Text fontSize="sm" color="slate.500">
                                Assigning student to <Text as="span" fontWeight="bold" color="slate.700">{staffName}</Text>
                            </Text>
                        )}

                        {/* Student Selection */}
                        <Box>
                            <Text fontSize="sm" fontWeight="bold" color="slate.700" mb="2">
                                Select Student <Text as="span" color="red.500">*</Text>
                            </Text>
                            <Select
                                options={studentOptions}
                                value={studentOptions.find((s) => s.value === studentId)}
                                onChange={(selected) => setStudentId(selected?.value || "")}
                                isLoading={isLoadingStudents}
                                placeholder="Search by name or matric number..."
                                isClearable
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        backgroundColor: "#F8FAFC",
                                        borderColor: "#E2E8F0",
                                        borderRadius: "8px",
                                        minHeight: "40px",
                                        boxShadow: "none",
                                        "&:hover": { borderColor: "#CBD5E1" },
                                    }),
                                }}
                            />
                        </Box>

                        {/* Level Selection */}
                        <Box>
                            <Text fontSize="sm" fontWeight="bold" color="slate.700" mb="2">Level (Optional)</Text>
                            <Select
                                options={levelOptions}
                                value={levelOptions.find((l) => l.value === level)}
                                onChange={(selected) => setLevel(selected?.value || "")}
                                placeholder="Select level..."
                                isClearable
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        backgroundColor: "#F8FAFC",
                                        borderColor: "#E2E8F0",
                                        borderRadius: "8px",
                                        minHeight: "40px",
                                        boxShadow: "none",
                                        "&:hover": { borderColor: "#CBD5E1" },
                                    }),
                                }}
                            />
                        </Box>
                    </Flex>
                </Box>

                {/* Footer */}
                <Flex p="6" borderTop="1px solid" borderColor="gray.100" justifyContent="flex-end" gap="3">
                    <Box 
                        as="button" 
                        onClick={onClose} 
                        px="6" 
                        py="2.5" 
                        borderRadius="lg" 
                        border="1px solid" 
                        borderColor="slate.300" 
                        color="slate.700" 
                        fontWeight="bold" 
                        fontSize="sm" 
                        cursor="pointer" 
                        _hover={{ bg: "slate.50" }}
                    >
                        Cancel
                    </Box>
                    <Flex 
                        as="button" 
                        onClick={handleSubmit} 
                        px="6" 
                        py="2.5" 
                        borderRadius="lg" 
                        bg="#1D7AD9" 
                        color="white" 
                        fontWeight="bold" 
                        fontSize="sm" 
                        cursor={(!studentId || isSubmitting) ? "not-allowed" : "pointer"} 
                        border="none" 
                        _hover={{ bg: "blue.600" }} 
                        boxShadow="lg" 
                        opacity={(!studentId || isSubmitting) ? 0.5 : 1} 
                        alignItems="center" 
                        gap="2"
                    >
                        {isSubmitting && <Spinner size="sm" />}
                        Assign Student
                    </Flex>
                </Flex>
            </Box>
        </Flex>
    );
};

export default AssignStudentModal;