import { useState, useRef } from "react";
import { X, Upload, FileUp } from "lucide-react";
import { toaster } from "@components/ui/toaster";
import { Box, Flex, Text, Spinner } from "@chakra-ui/react";
import { CourseServices } from "@services/course.service";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onUploaded: () => void;
}

const BulkUploadCoursesModal = ({ isOpen, onClose, onUploaded }: Props) => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) setFile(selected);
    };

    const handleUpload = async () => {
        if (!file) {
            toaster.error({ title: "Please select a file first" });
            return;
        }

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", file);

            await CourseServices.bulkUploadCourses(formData);

            toaster.success({ title: "Courses uploaded successfully!" });
            onUploaded();
        } catch (err: any) {
            console.error("Bulk upload failed", err);
            toaster.error({ title: err.response?.data?.message || "Failed to upload courses" });
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Flex
            position="fixed"
            top="0" left="0" right="0" bottom="0"
            bg="blackAlpha.600"
            zIndex="9999"
            alignItems="center"
            justifyContent="center"
            p="4"
            backdropFilter="blur(4px)"
            animation="fadeIn 0.2s ease-out"
        >
            <Box bg="white" borderRadius="2xl" shadow="xl" w="full" maxW="lg" position="relative" animation="slideUp 0.3s ease-out">
                {/* Header */}
                <Box p="6" borderBottom="1px solid" borderColor="slate.100">
                    <Box as="button" onClick={handleClose} position="absolute" top="4" right="4" p="1" _hover={{ bg: "slate.100" }} borderRadius="full" cursor="pointer" border="none" bg="transparent" color="slate.400"><X size={20} /></Box>
                    <Text fontSize="lg" fontWeight="bold" color="slate.800" mb="2">Upload Courses</Text>
                    <Text fontSize="sm" color="slate.500" mb="4">Upload a CSV file containing the courses data. Download the sample file below to see the required format.</Text>
                    
                    <a href="/departmental-admin/documents/Course_Sample_File.csv" download="Course_Sample_File.csv" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600, color: "#2563eb", textDecoration: "none", transition: "color 0.2s" }}>
                        <FileUp size={16} /> Download Sample CSV Template
                    </a>
                </Box>

                {/* Upload Zone */}
                <Box p="6">
                    <Flex
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        border="2px dashed"
                        borderColor={file ? "blue.400" : "slate.200"}
                        bg={file ? "blue.50" : "transparent"}
                        borderRadius="xl"
                        p="8"
                        cursor="pointer"
                        _hover={{ borderColor: "blue.400", bg: "blue.50" }}
                        transition="all 0.2s"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                        {file ? (
                            <Flex direction="column" alignItems="center" gap="2">
                                <FileUp size={28} color="#3b82f6" />
                                <Text fontSize="sm" fontWeight="semibold" color="slate.700">{file.name}</Text>
                                <Text fontSize="xs" color="slate.500">{(file.size / 1024).toFixed(1)} KB</Text>
                            </Flex>
                        ) : (
                            <Flex direction="column" alignItems="center" gap="2">
                                <Upload size={28} color="#94a3b8" />
                                <Text fontSize="sm" fontWeight="medium" color="slate.500">Click to select a file</Text>
                                <Text fontSize="xs" color="slate.400">Supports CSV, XLSX, XLS</Text>
                            </Flex>
                        )}
                    </Flex>
                </Box>

                {/* Actions */}
                <Flex p="6" borderTop="1px solid" borderColor="slate.100" justifyContent="flex-end" gap="3">
                    <Box as="button" onClick={handleClose} px="5" py="2.5" borderRadius="lg" fontSize="sm" fontWeight="bold" bg="slate.100" color="slate.600" border="1px solid" borderColor="slate.200" cursor="pointer" _hover={{ bg: "slate.200" }}>Cancel</Box>
                    <Flex as="button" onClick={handleUpload} px="5" py="2.5" borderRadius="lg" fontSize="sm" fontWeight="bold" bg="#1D7AD9" color="white" cursor={(!file || isUploading) ? "not-allowed" : "pointer"} border="none" _hover={{ bg: (!file || isUploading) ? "#1D7AD9" : "blue.700" }} opacity={(!file || isUploading) ? 0.5 : 1} alignItems="center" gap="2">
                        {isUploading && <Spinner size="sm" />}
                        {isUploading ? "Uploading..." : "Upload"}
                    </Flex>
                </Flex>
            </Box>
        </Flex>
    );
};

export default BulkUploadCoursesModal;
