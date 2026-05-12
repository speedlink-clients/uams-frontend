import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { CourseServices } from "@services/course.service";
// import { toaster } from "@components/ui/toaster";
import Select from "react-select";
import { Box, Flex, Text, Spinner, Button, Input } from "@chakra-ui/react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (data: { courseId: string; session: string }) => Promise<void>;
    staffName?: string;
}

interface CourseOption {
    value: string;
    label: string;
}

const AssignCourseModal = ({ isOpen, onClose, onAssign, staffName }: Props) => {
    const [courseId, setCourseId] = useState("");
    const [session, setSession] = useState("2025/2026");
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const courseOptions: CourseOption[] = courses.map((c: any) => ({
        value: c.id,
        label: `${c.code} - ${c.title || c.name}`,
    }));

    useEffect(() => {
        if (isOpen) {
            setCourseId("");
            setSession("2025/2026");
            fetchCourses();
        }
    }, [isOpen]);

    const fetchCourses = async () => {
        try {
            setIsLoadingCourses(true);
            const response = await CourseServices.getCourses();
            const list = Array.isArray(response) ? response : (response as any)?.data || (response as any)?.courses || [];
            setCourses(list);
        } catch (err) {
            console.error("Failed to fetch courses:", err);
        } finally {
            setIsLoadingCourses(false);
        }
    };

    const handleSubmit = async () => {
        if (!courseId || !session) return;
        setIsSubmitting(true);
        try {
            await onAssign({ courseId, session });
            onClose();
        } catch (err) {
            console.error("Failed to assign course:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;


    return (
        <Flex position="fixed" top="0" left="0" right="0" bottom="0" bg="blackAlpha.600" zIndex="9999" alignItems="center" justifyContent="center" p="4" backdropFilter="blur(4px)">
            <Box bg="white" borderRadius="2xl" shadow="2xl" w="full" maxW="lg" overflow="hidden">
                {/* Header */}
                <Flex p="6" borderBottom="xs" borderColor="border.muted" alignItems="center" justifyContent="space-between">
                    <Text fontSize="xl" fontWeight="bold" color="#1D7AD9">Assign Course To Lecturer</Text>
                    <Button onClick={onClose} p="2" _hover={{ bg: "slate.50" }} borderRadius="full" color="fg.subtle" cursor="pointer" bg="transparent">
                        <X size={20} />
                    </Button>
                </Flex>

                {/* Body */}
                <Box p="6">
                    <Flex direction="column" gap="6">
                        {staffName && (
                            <Text fontSize="sm" color="fg.muted">Assigning course to <Text as="span" fontWeight="bold" color="fg.muted">{staffName}</Text></Text>
                        )}

                        <Box>
                            <Text fontSize="sm" fontWeight="bold" color="fg.muted" mb="2">Name of course</Text>
                            <Select
                                options={courseOptions}
                                value={courseOptions.find((c) => c.value === courseId)}
                                onChange={(selected) => setCourseId(selected?.value || "")}
                                isLoading={isLoadingCourses}
                                placeholder="Select a course..."
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

                        <Box>
                            <Text fontSize="sm" fontWeight="bold" color="fg.muted" mb="2">Academic Session</Text>
                            <Input
                                value={session}
                                onChange={(e) => setSession(e.target.value)}
                                placeholder="e.g. 2025/2026"
                                bg="#F8FAFC"
                                borderColor="#E2E8F0"
                                borderRadius="8px"
                                minHeight="40px"
                                fontSize="sm"
                            />
                        </Box>
                    </Flex>
                </Box>

                {/* Footer */}
                <Flex p="6" borderTop="xs" borderColor="border.muted" justifyContent="flex-end" gap="3">
                    <Button onClick={onClose} px="6" py="2.5" borderRadius="lg" border="xs" borderColor="border.muted" color="fg.muted" fontWeight="bold" fontSize="sm" cursor="pointer" _hover={{ bg: "slate.50" }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} px="6" py="2.5" borderRadius="lg" bg="#1D7AD9" color="white" fontWeight="bold" fontSize="sm" cursor={(!courseId || isSubmitting) ? "not-allowed" : "pointer"} _hover={{ bg: "blue.600" }} boxShadow="lg" opacity={(!courseId || isSubmitting) ? 0.5 : 1} alignItems="center" gap="2">
                        {isSubmitting && <Spinner size="sm" />}
                        Assign Course
                    </Button>
                </Flex>
            </Box>
        </Flex>
    );
};

export default AssignCourseModal;
