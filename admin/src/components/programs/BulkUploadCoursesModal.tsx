import { useState, useRef } from "react";
import { Upload, FileUp, Download } from "lucide-react";
import { toaster } from "@components/ui/toaster";
import { 
  Box, 
  Flex, 
  Text,
  Button, 
  Input,
  Dialog,
  Portal,
  VStack,
  DownloadTrigger
} from "@chakra-ui/react";
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

    const handleDownloadSample = async () => {
        try {
            const response = await fetch("/departmental-admin/documents/Course_Sample_File.xlsx");
            if (!response.ok) throw new Error("Failed to download template");
            return await response.blob();
        } catch (err) {
            toaster.error({ title: "Failed to download sample file" });
            throw err;
        }
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

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && handleClose()} size="lg">
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content borderRadius="2xl" overflow="hidden">
                        <Dialog.CloseTrigger />
                        <Dialog.Header p="6" borderBottom="xs" borderColor="border.muted">
                            <Flex alignItems="center" gap="3">
                                <Flex bg="blue.50" p="2.5" borderRadius="lg">
                                    <Upload size={20} color="#2563eb" />
                                </Flex>
                                <Box>
                                    <Dialog.Title fontSize="lg" fontWeight="bold" color="slate.800">Bulk Upload Courses</Dialog.Title>
                                    <Dialog.Description fontSize="sm" color="slate.500" mt="1">
                                        Upload an Excel file containing courses data.
                                    </Dialog.Description>
                                </Box>
                            </Flex>
                        </Dialog.Header>

                        <Dialog.Body p="8">
                            <VStack gap="6" align="stretch">
                                <Box bg="blue.50/50" p="4" borderRadius="lg" border="1px dashed" borderColor="blue.200">
                                    <Flex alignItems="center" gap="3">
                                        <FileUp size={18} color="#2563eb" />
                                        <Box>
                                            <Text fontSize="sm" fontWeight="bold" color="slate.800">Reference Template</Text>
                                            <Text fontSize="xs" color="slate.500">Download the sample file to ensure your data is formatted correctly.</Text>
                                        </Box>
                                        <DownloadTrigger
                                            data={() => handleDownloadSample()}
                                            fileName="Course_Sample_File.xlsx"
                                            mimeType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                            asChild
                                        >
                                            <Button 
                                                variant="ghost" 
                                                color="blue.600" 
                                                size="sm" 
                                                ml="auto"
                                                fontWeight="bold"
                                            >
                                                <Download size={14} style={{ marginRight: '6px' }} />
                                                Download
                                            </Button>
                                        </DownloadTrigger>
                                    </Flex>
                                </Box>

                                <Flex
                                    direction="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    border="2px dashed"
                                    borderColor={file ? "blue.400" : "slate.200"}
                                    bg={file ? "blue.50/30" : "transparent"}
                                    borderRadius="xl"
                                    p="10"
                                    cursor="pointer"
                                    _hover={{ borderColor: "blue.400", bg: "blue.50/30" }}
                                    transition="all 0.2s"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Input
                                        type="file"
                                        accept=".xlsx,.xls"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        style={{ display: "none" }}
                                    />
                                    {file ? (
                                        <VStack gap="2">
                                            <FileUp size={32} color="#3b82f6" />
                                            <Text fontSize="sm" fontWeight="bold" color="slate.800">{file.name}</Text>
                                            <Text fontSize="xs" color="slate.500">{(file.size / 1024).toFixed(1)} KB</Text>
                                        </VStack>
                                    ) : (
                                        <VStack gap="2">
                                            <Upload size={32} color="#94a3b8" />
                                            <Text fontSize="sm" fontWeight="bold" color="slate.600">Click to select file</Text>
                                            <Text fontSize="xs" color="slate.400">Supports .XLSX, .XLS</Text>
                                        </VStack>
                                    )}
                                </Flex>
                            </VStack>
                        </Dialog.Body>

                        <Dialog.Footer p="6" borderTop="xs" borderColor="border.muted" gap="3">
                            <Dialog.ActionTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    borderColor="border.muted" 
                                    color="slate.600"
                                    px="6"
                                    fontWeight="bold"
                                >
                                    Cancel
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button 
                                onClick={handleUpload}
                                loading={isUploading}
                                loadingText="Uploading..."
                                bg="#1D7AD9" 
                                color="white"
                                px="8"
                                fontWeight="bold"
                                disabled={!file}
                            >
                                Start Upload
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default BulkUploadCoursesModal;
