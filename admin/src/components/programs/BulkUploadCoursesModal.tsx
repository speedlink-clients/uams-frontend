import { useState } from "react";
import { Upload, FileUp, Download } from "lucide-react";
import { toaster } from "@components/ui/toaster";
import { 
  Box, 
  Flex, 
  Text,
  Button, 
  Dialog,
  Portal,
  VStack,
  DownloadTrigger,
  CloseButton,
  Icon,
  FileUpload
} from "@chakra-ui/react";
import { CourseHook } from "@hooks/course.hook";
import axios from "axios";

interface Props {
    children: React.ReactNode;
}

const BulkUploadCoursesModal = ({ children }: Props) => {
    const [file, setFile] = useState<File | null>(null);
    const { mutate: uploadCourses, isPending: isUploading } = CourseHook.useBulkUploadCourses();

    const handleDownloadSample = async () => {
        try {
            const response = await axios.get("/sample-courses-upload.xlsx", {
                responseType: "blob",
            });
            return response.data;
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
        const formData = new FormData();
        formData.append("file", file);
        uploadCourses(formData);
    };


    return (
        <Dialog.Root size="lg" role="alertdialog" onExitComplete={() => setFile(null)}>
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content rounded="md" overflow="hidden">
                        <Dialog.Header p="6" borderBottom="xs" borderColor="border.muted">
                            <Flex alignItems="center" gap="3">
                                <Icon bg="blue.50" p="2.5" rounded="lg" boxSize="10">
                                    <Upload />
                                </Icon>
                                <Box>
                                    <Dialog.Title fontSize="lg" fontWeight="bold" color="slate.800">Bulk Upload Courses</Dialog.Title>
                                    <Dialog.Description fontSize="sm" color="fg.muted" mt="1">
                                        Upload an Excel file containing courses data.
                                    </Dialog.Description>
                                </Box>
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton />
                                </Dialog.CloseTrigger>
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

                                <FileUpload.Root
                                    onFileChange={(details) => setFile(details.acceptedFiles[0] || null)}
                                    accept={[".xlsx", ".xls"]}
                                    maxFiles={1}
                                    maxFileSize={5 * 1024 * 1024}
                                >
                                    <FileUpload.Dropzone
                                        border="2px dashed"
                                        borderColor={file ? "blue.400" : "slate.200"}
                                        bg={file ? "blue.50/30" : "transparent"}
                                        borderRadius="xl"
                                        p="10"
                                        cursor="pointer"
                                        _hover={{ borderColor: "blue.400", bg: "blue.50/30" }}
                                        transition="all 0.2s"
                                        flexDirection="column"
                                        width="100%"
                                        alignItems="center"
                                        justifyContent="center"
                                        display="flex"
                                    >
                                        <FileUpload.HiddenInput />
                                        {file ? (
                                            <VStack gap="2">
                                                <FileUp size={32} color="#3b82f6" />
                                                <Text fontSize="sm" fontWeight="bold" color="slate.800">{file.name}</Text>
                                                <Text fontSize="xs" color="slate.500">{(file.size / 1024).toFixed(1)} KB</Text>
                                                <Button
                                                    size="xs"
                                                    variant="ghost"
                                                    color="red.500"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFile(null);
                                                    }}
                                                >
                                                    Remove file
                                                </Button>
                                            </VStack>
                                        ) : (
                                            <VStack gap="2">
                                                <Upload size={32} color="#94a3b8" />
                                                <VStack gap="0">
                                                    <Text fontSize="sm" fontWeight="bold" color="slate.800">Click or drag to upload</Text>
                                                    <Text fontSize="xs" color="slate.500">Excel files only (.xlsx, .xls)</Text>
                                                </VStack>
                                            </VStack>
                                        )}
                                    </FileUpload.Dropzone>
                                </FileUpload.Root>
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
