import { useState, useEffect, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { IDCardServices } from "@services/idcard.service";
import { toaster } from "@components/ui/toaster";
import { Box, Flex, Text, Image, Spinner } from "@chakra-ui/react";

const UploadBox = ({ label, type, preview, fileRef, onFileChange }: { label: string; type: string; preview: string; fileRef: React.RefObject<HTMLInputElement | null>; onFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void }) => {
    return (
        <Box>
            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">{label}</Text>
            <Flex
                border="2px dashed" borderColor="gray.200" borderRadius="xl" p="4"
                alignItems="center" justifyContent="center" minH="120px" bg="slate.50"
                cursor="pointer" _hover={{ borderColor: "blue.300", bg: "blue.50" }}
                transition="all 0.2s" onClick={() => fileRef?.current?.click()} position="relative"
            >
                <input type="file" accept="image/*" ref={fileRef} onChange={(e) => onFileChange(e, type)} style={{ display: "none" }} />
                {preview ? (
                    <Image src={preview} alt={label} maxH="100px" maxW="200px" objectFit="contain" borderRadius="md" />
                ) : (
                    <Flex direction="column" alignItems="center" gap="2">
                        <Upload size={24} color="#94a3b8" />
                        <Text fontSize="xs" color="slate.400">Click to upload (max 70KB)</Text>
                    </Flex>
                )}
            </Flex>
        </Box>
    );
};

const IDCardSettingsTab = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [templateId, setTemplateId] = useState("");
    const [previews, setPreviews] = useState<Record<string, string>>({});
    const [files, setFiles] = useState<Record<string, File>>({});

    const [formData, setFormData] = useState({
        schoolName: "",
        faculty: "",
        department: "",
        schoolAddress: "",
        backDescription: "",
        backDisclaimer: "",
    });

    const [initialFormData, setInitialFormData] = useState<typeof formData>({
        schoolName: "",
        faculty: "",
        department: "",
        schoolAddress: "",
        backDescription: "",
        backDisclaimer: "",
    });

    const fileInputRefs = {
        logo: useRef<HTMLInputElement>(null),
        signature: useRef<HTMLInputElement>(null),
        frontTemplate: useRef<HTMLInputElement>(null),
        backTemplate: useRef<HTMLInputElement>(null),
    };

    // Store existing image URLs for preview
    const [existingUrls, setExistingUrls] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setIsLoading(true);
            const data = await IDCardServices.getDefaultIDCard();
            if (data?.success && data.template) {
                const t = data.template;
                setTemplateId(t.id || "");
                const fd = {
                    schoolName: t.institutionName || "",
                    faculty: t.faculties?.[0]?.name || "",
                    department: t.departments?.[0]?.name || "",
                    schoolAddress: t.institutionAddress || "",
                    backDescription: t.backDescription || "",
                    backDisclaimer: t.backDisclaimer || "",
                };
                setFormData(fd);
                setInitialFormData(fd);
                setExistingUrls({
                    logo: t.logo || "",
                    signature: t.hodSignature || t.signature || "",
                    frontTemplate: t.frontTemplate || t.frontCardTemplate || "",
                    backTemplate: t.backTemplate || t.backCardTemplate || "",
                });
            }
        } catch (err) {
            console.error("Failed to fetch ID card settings", err);
            toaster.error({ title: "Failed to load ID card settings" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 70 * 1024) {
            toaster.error({ title: "File too large. Max size is 70KB." });
            e.target.value = "";
            return;
        }
        setFiles((prev) => ({ ...prev, [type]: file }));
        const reader = new FileReader();
        reader.onloadend = () => setPreviews((prev) => ({ ...prev, [type]: reader.result as string }));
        reader.readAsDataURL(file);
    };

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSave = async () => {
        if (!templateId) {
            toaster.error({ title: "Template ID not found" });
            return;
        }
        setIsSaving(true);
        try {
            const payload: any = {};

            // Only send changed text fields
            if (formData.schoolName !== initialFormData.schoolName) payload.institutionName = formData.schoolName;
            if (formData.schoolAddress !== initialFormData.schoolAddress) payload.institutionAddress = formData.schoolAddress;
            if (formData.department !== initialFormData.department) payload.department = formData.department;
            if (formData.faculty !== initialFormData.faculty) payload.faculty = formData.faculty;
            if (formData.backDescription !== initialFormData.backDescription) payload.backDescription = formData.backDescription;
            if (formData.backDisclaimer !== initialFormData.backDisclaimer) payload.backDisclaimer = formData.backDisclaimer;

            // Convert files to base64
            if (files.logo) payload.logo = await convertFileToBase64(files.logo);
            if (files.signature) payload.hodSignature = await convertFileToBase64(files.signature);
            if (files.frontTemplate) payload.frontTemplate = await convertFileToBase64(files.frontTemplate);
            if (files.backTemplate) payload.backTemplate = await convertFileToBase64(files.backTemplate);

            await IDCardServices.updateIDCard(templateId, payload);
            toaster.success({ title: "ID Card settings updated" });
            setFiles({});
            setPreviews({});
            await fetchSettings();
        } catch (err: any) {
            toaster.error({ title: err.response?.data?.message || "Failed to update settings" });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <Flex justifyContent="center" py="20"><Spinner size="lg" color="blue.500" /></Flex>;
    }

    const inputStyle: React.CSSProperties = {
        width: "100%", padding: "10px 16px", background: "#f8fafc", border: "1px solid #e2e8f0",
        borderRadius: "8px", fontSize: "14px", color: "#334155", outline: "none",
    };



    return (
        <Flex direction="column" gap="8">
            {/* Institution Details */}
            <Box bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.100" boxShadow="sm" p="8">
                <Text fontSize="lg" fontWeight="bold" color="slate.800" mb="6">Institution Details</Text>
                <Flex direction="column" gap="5">
                    <Flex gap="6" direction={{ base: "column", md: "row" }}>
                        <Box flex="1">
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">School Name</Text>
                            <input
                                type="text" value={formData.schoolName}
                                onChange={(e) => setFormData((p) => ({ ...p, schoolName: e.target.value }))}
                                placeholder="University name"
                                className="idcard-settings-input" style={inputStyle}
                            />
                        </Box>
                        <Box flex="1">
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Faculty</Text>
                            <input
                                type="text" value={formData.faculty}
                                onChange={(e) => setFormData((p) => ({ ...p, faculty: e.target.value }))}
                                placeholder="Faculty name"
                                className="idcard-settings-input" style={inputStyle}
                            />
                        </Box>
                    </Flex>
                    <Flex gap="6" direction={{ base: "column", md: "row" }}>
                        <Box flex="1">
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">Department</Text>
                            <input
                                type="text" value={formData.department}
                                onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))}
                                placeholder="Department name"
                                className="idcard-settings-input" style={inputStyle}
                            />
                        </Box>
                        <Box flex="1">
                            <Text fontSize="sm" fontWeight="medium" color="slate.700" mb="2">School Address</Text>
                            <input
                                type="text" value={formData.schoolAddress}
                                onChange={(e) => setFormData((p) => ({ ...p, schoolAddress: e.target.value }))}
                                placeholder="School address"
                                className="idcard-settings-input" style={inputStyle}
                            />
                        </Box>
                    </Flex>
                </Flex>
            </Box>

            {/* Templates */}
            <Box bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.100" boxShadow="sm" p="8">
                <Text fontSize="lg" fontWeight="bold" color="slate.800" mb="6">Card Templates</Text>
                <Flex direction={{ base: "column", md: "row" }} gap="6">
                    <Box flex="1"><UploadBox label="Front Template" type="frontTemplate" preview={previews.frontTemplate || existingUrls.frontTemplate} fileRef={fileInputRefs.frontTemplate} onFileChange={handleFileChange} /></Box>
                    <Box flex="1"><UploadBox label="Back Template" type="backTemplate" preview={previews.backTemplate || existingUrls.backTemplate} fileRef={fileInputRefs.backTemplate} onFileChange={handleFileChange} /></Box>
                </Flex>
            </Box>

            {/* Branding */}
            <Box bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.100" boxShadow="sm" p="8">
                <Text fontSize="lg" fontWeight="bold" color="slate.800" mb="6">Branding</Text>
                <Flex direction={{ base: "column", md: "row" }} gap="6">
                    <Box flex="1"><UploadBox label="University Logo" type="logo" preview={previews.logo || existingUrls.logo} fileRef={fileInputRefs.logo} onFileChange={handleFileChange} /></Box>
                    <Box flex="1"><UploadBox label="HOD Signature" type="signature" preview={previews.signature || existingUrls.signature} fileRef={fileInputRefs.signature} onFileChange={handleFileChange} /></Box>
                </Flex>
            </Box>

            {/* Back Card Text */}
            <Box bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.100" boxShadow="sm" p="8">
                <Text fontSize="lg" fontWeight="bold" color="slate.800" mb="6">Back Card Content</Text>
                <Flex direction="column" gap="6">
                    <Box>
                        <Flex justifyContent="space-between" mb="2">
                            <Text fontSize="sm" fontWeight="medium" color="slate.700">Description</Text>
                            <Text fontSize="xs" color="slate.400">{formData.backDescription.length}/120</Text>
                        </Flex>
                        <textarea
                            value={formData.backDescription}
                            onChange={(e) => setFormData((p) => ({ ...p, backDescription: e.target.value.slice(0, 120) }))}
                            maxLength={120} rows={3}
                            className="idcard-settings-input"
                            style={{ ...inputStyle, resize: "none", fontFamily: "inherit" }}
                        />
                    </Box>
                    <Box>
                        <Flex justifyContent="space-between" mb="2">
                            <Text fontSize="sm" fontWeight="medium" color="slate.700">Disclaimer</Text>
                            <Text fontSize="xs" color="slate.400">{formData.backDisclaimer.length}/95</Text>
                        </Flex>
                        <textarea
                            value={formData.backDisclaimer}
                            onChange={(e) => setFormData((p) => ({ ...p, backDisclaimer: e.target.value.slice(0, 95) }))}
                            maxLength={95} rows={3}
                            className="idcard-settings-input"
                            style={{ ...inputStyle, resize: "none", fontFamily: "inherit" }}
                        />
                    </Box>
                </Flex>
            </Box>

            {/* Save */}
            <Flex justifyContent="flex-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{
                        padding: "10px 32px", background: "#1D7AD9", color: "white", fontWeight: 700,
                        borderRadius: "8px", fontSize: "14px", border: "none",
                        cursor: isSaving ? "not-allowed" : "pointer",
                        opacity: isSaving ? 0.7 : 1,
                        display: "flex", alignItems: "center", gap: "8px",
                        boxShadow: "0 4px 12px rgba(29,122,217,0.2)",
                    }}
                >
                    {isSaving && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </Flex>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .idcard-settings-input:focus { box-shadow: 0 0 0 3px rgba(29, 122, 217, 0.2) !important; border-color: #1D7AD9 !important; }
            `}</style>
        </Flex>
    );
};

export default IDCardSettingsTab;
