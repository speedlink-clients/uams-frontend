import { useState, useRef } from "react";
import { X, Upload, Download, FileSpreadsheet } from "lucide-react";
import axiosClient from "@configs/axios.config";
import { toaster } from "@components/ui/toaster";
import { Box, Flex, Text, Spinner } from "@chakra-ui/react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onUploaded: () => void;
}

const BulkUploadStudentsModal = ({ isOpen, onClose, onUploaded }: Props) => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            if (!selected.name.endsWith(".csv") && !selected.name.endsWith(".xlsx")) {
                toaster.error({ title: "Please upload a CSV or Excel file" });
                return;
            }
            setFile(selected);
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await axiosClient.post("/department-admins/students/bulk-upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const data = response.data;
            setResult({ success: data.successCount || data.created || 0, failed: data.failedCount || data.failed || 0, errors: data.errors || [] });
            toaster.success({ title: `${data.successCount || data.created || 0} students uploaded successfully` });
            onUploaded();
        } catch (err: any) {
            toaster.error({ title: err.response?.data?.message || "Upload failed" });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDownloadSample = () => {
        const link = document.createElement("a");
        link.href = "/departmental-admin/sample-students.csv";
        link.download = "sample-students.csv";
        link.click();
    };

    const handleClose = () => {
        setFile(null);
        setResult(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Box position="fixed" inset="0" bg="blackAlpha.600" display="flex" alignItems="center" justifyContent="center" zIndex="100" p="4">
            <Box bg="white" borderRadius="2xl" p="8" maxW="lg" w="full" boxShadow="2xl" position="relative">
                <Box as="button" onClick={handleClose} position="absolute" top="4" right="4" p="1" _hover={{ bg: "fg.subtle" }} borderRadius="full" cursor="pointer" border="none" bg="transparent" color="fg.subtle"><X size={20} /></Box>

                <Text fontSize="lg" fontWeight="bold" color="fg.muted" mb="2">Bulk Upload Students</Text>
                <Text fontSize="sm" color="fg.muted" mb="6">Upload a CSV or Excel file with student data</Text>

                {/* Download Sample */}
                <Box as="button" onClick={handleDownloadSample} display="flex" alignItems="center" gap="2" mb="6" px="4" py="2" bg="blue.50" color="blue.600" borderRadius="lg" fontSize="sm" fontWeight="medium" border="none" cursor="pointer" _hover={{ bg: "blue.100" }}>
                    <Download size={16} /> Download Sample Template
                </Box>

                {/* Upload Zone */}
                <Flex
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    border="2px dashed"
                    borderColor={file ? "green.300" : "gray.200"}
                    borderRadius="xl"
                    p="8"
                    bg={file ? "green.50" : "slate.50"}
                    cursor="pointer"
                    _hover={{ borderColor: "blue.300", bg: "blue.50" }}
                    transition="all 0.2s"
                    onClick={() => fileInputRef.current?.click()}
                    mb="4"
                >
                    <input type="file" ref={fileInputRef} accept=".csv,.xlsx" onChange={handleFileChange} style={{ display: "none" }} />
                    {file ? (
                        <Flex alignItems="center" gap="3">
                            <FileSpreadsheet size={24} color="#16a34a" />
                            <Box>
                                <Text fontSize="sm" fontWeight="medium" color="green.700">{file.name}</Text>
                                <Text fontSize="xs" color="fg.muted">{(file.size / 1024).toFixed(1)} KB</Text>
                            </Box>
                        </Flex>
                    ) : (
                        <>
                            <Upload size={28} color="#94a3b8" />
                            <Text fontSize="sm" color="fg.muted" mt="2">Click to select a file or drag and drop</Text>
                            <Text fontSize="xs" color="fg.subtle" mt="1">CSV or XLSX files only</Text>
                        </>
                    )}
                </Flex>

                {/* Upload Result */}
                {result && (
                    <Box bg="slate.50" borderRadius="lg" p="4" mb="4">
                        <Flex gap="4" mb={result.errors.length > 0 ? "3" : "0"}>
                            <Text fontSize="sm"><Text as="span" fontWeight="bold" color="green.600">{result.success}</Text> uploaded</Text>
                            {result.failed > 0 && <Text fontSize="sm"><Text as="span" fontWeight="bold" color="red.600">{result.failed}</Text> failed</Text>}
                        </Flex>
                        {result.errors.length > 0 && (
                            <Box maxH="120px" overflowY="auto">
                                {result.errors.slice(0, 5).map((err, i) => (
                                    <Text key={i} fontSize="xs" color="red.600">• {err}</Text>
                                ))}
                                {result.errors.length > 5 && <Text fontSize="xs" color="fg.muted">...and {result.errors.length - 5} more errors</Text>}
                            </Box>
                        )}
                    </Box>
                )}

                {/* Actions */}
                <Flex justifyContent="flex-end" gap="3">
                    <Box as="button" onClick={handleClose} px="6" py="2.5" borderRadius="lg" fontSize="sm" border="xs" borderColor="border.muted" color="fg.muted" cursor="pointer" _hover={{ bg: "slate.50" }}>Close</Box>
                    <Flex as="button" onClick={handleUpload} px="6" py="2.5" borderRadius="lg" fontSize="sm" fontWeight="bold" bg="#00B01D" color="white" cursor="pointer" border="none" _hover={{ bg: "green.700" }} opacity={(!file || isUploading) ? 0.5 : 1} display="flex" alignItems="center" gap="2">
                        {isUploading ? <><Spinner size="sm" /> Uploading...</> : <><Upload size={16} /> Upload</>}
                    </Flex>
                </Flex>
            </Box>
        </Box>
    );
};

export default BulkUploadStudentsModal;
