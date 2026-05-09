import { useState, useEffect, useRef, useMemo } from "react";
import { Search, Camera, Download, X, Upload, Loader2, IdCard } from "lucide-react";
import axiosClient from "@configs/axios.config";
import { IDCardServices } from "@services/idcard.service";
import { toaster } from "@components/ui/toaster";
import { exportToExcel } from "@utils/excel.util";
import { Box, Flex, Text, Button, EmptyState, Table } from "@chakra-ui/react";

import type { Student, IDCardSettings } from "@type/idCard.type";

const ITEMS_PER_PAGE = 20;

const IDCardPage = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "unpaid">("all");
    const [levelFilter, setLevelFilter] = useState("all");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [generatingPDF, setGeneratingPDF] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [idCardSettings, setIdCardSettings] = useState<IDCardSettings | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch ID card settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await IDCardServices.getDefaultIDCard();
                if (response?.template) {
                    setIdCardSettings({
                        frontTemplate: response.template.frontCardTemplate || response.template.frontTemplate,
                        backTemplate: response.template.backCardTemplate || response.template.backTemplate,
                        backDescription: response.template.backDescription,
                        backDisclaimer: response.template.backDisclaimer,
                        signature: response.template.hodSignature || response.template.signature,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch ID card settings", error);
            }
        };
        fetchSettings();
    }, []);

    // Fetch students
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get("/university-admin/students", { params: { limit: 1000 } });
                const transformed: Student[] = (response.data.students || []).map((s: any) => ({
                    id: s.id,
                    idNo: s.studentId,
                    name: s.user?.fullName || "N/A",
                    matric: s.studentId,
                    faculty: s.Department?.Faculty?.name || "N/A",
                    department: s.Department?.name || "N/A",
                    level: s.level || "N/A",
                    graduationDate: "2026-06-15",
                    hasPaidIDCardFee: s.PaymentTransactions?.some((t: any) => t.payment_for === "ID Card Fee Payment" && t.status === "success") || false,
                    avatar: s.user?.avatar || "",
                }));
                setStudents(transformed);
            } catch (err) {
                console.error("Failed to fetch students", err);
                toaster.error({ title: "Failed to load students" });
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    // Filters
    const uniqueLevels = useMemo(() => Array.from(new Set(students.map((s) => s.level).filter((l) => l && l !== "N/A"))).sort(), [students]);

    const allFiltered = useMemo(() => {
        return students.filter((s) => {
            const matchesStatus = statusFilter === "all" || (statusFilter === "paid" && s.hasPaidIDCardFee) || (statusFilter === "unpaid" && !s.hasPaidIDCardFee);
            const matchesLevel = levelFilter === "all" || s.level === levelFilter;
            const q = searchQuery.toLowerCase();
            const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.matric.toLowerCase().includes(q) || s.department.toLowerCase().includes(q) || s.faculty.toLowerCase().includes(q);
            return matchesStatus && matchesLevel && matchesSearch;
        });
    }, [students, statusFilter, levelFilter, searchQuery]);

    const totalPages = Math.ceil(allFiltered.length / ITEMS_PER_PAGE) || 1;
    const paginatedStudents = allFiltered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter, levelFilter]);

    // Selection
    const toggleSelection = (id: string) => setSelectedIds((p) => p.includes(id) ? p.filter((i) => i !== id) : [...p, id]);
    const toggleSelectAll = () => setSelectedIds(selectedIds.length === paginatedStudents.length && paginatedStudents.length > 0 ? [] : paginatedStudents.map((s) => s.id));

    // Camera
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
            if (videoRef.current) { videoRef.current.srcObject = stream; setCameraActive(true); }
        } catch { toaster.error({ title: "Camera access denied" }); }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
            videoRef.current.srcObject = null;
        }
        setCameraActive(false);
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) { ctx.drawImage(videoRef.current, 0, 0, 640, 480); setCapturedPhoto(canvasRef.current.toDataURL("image/jpeg", 0.9)); stopCamera(); }
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { toaster.error({ title: "File too large (max 5MB)" }); return; }
        const reader = new FileReader();
        reader.onloadend = () => { setCapturedPhoto(reader.result as string); stopCamera(); };
        reader.readAsDataURL(file);
    };

    const handleIssueCard = (student: Student) => {
        setCurrentStudent(student);
        setCapturedPhoto(null);
        setShowModal(true);
        setTimeout(() => startCamera(), 100);
    };

    // Upload photo to server
    const uploadPhotoToServer = async (): Promise<boolean> => {
        if (!currentStudent || !capturedPhoto) return false;
        setUploadingPhoto(true);
        try {
            const response = await fetch(capturedPhoto);
            const blob = await response.blob();
            const formData = new FormData();
            formData.append("avatar", blob, `${currentStudent.matric}.jpg`);
            await axiosClient.put(`/department-admins/students/avatar?studentId=${currentStudent.matric}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
            return true;
        } catch (err: any) {
            toaster.error({ title: err.response?.data?.message || "Failed to upload photo" });
            return false;
        } finally {
            setUploadingPhoto(false);
        }
    };

    // Generate PDF
    const generateIDCardPDF = async () => {
        if (!currentStudent || !capturedPhoto) return;
        setGeneratingPDF(true);
        try {
            const uploadSuccess = await uploadPhotoToServer();
            if (!uploadSuccess) { setGeneratingPDF(false); return; }

            const { jsPDF } = await import("jspdf");
            const cardWidth = 85.6, cardHeight = 54;
            const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [cardWidth, cardHeight] });

            const loadImage = (src: string): Promise<HTMLImageElement | null> => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.crossOrigin = "anonymous";
                    img.onload = () => resolve(img);
                    img.onerror = () => {
                        console.error(`Failed to load image: ${src}`);
                        resolve(null);
                    };
                    img.src = src;
                    setTimeout(() => resolve(null), 10000); // 10s timeout
                });
            };

            const frontSrc = idCardSettings?.frontTemplate || "/departmental-admin/idcard-front.png";
            const backSrc = idCardSettings?.backTemplate || "/departmental-admin/idcard-back.png";

            const [frontTemplate, backTemplate] = await Promise.all([
                loadImage(frontSrc),
                loadImage(backSrc)
            ]);

            if (!frontTemplate) {
                toaster.error({ title: "Failed to load ID card template" });
                setGeneratingPDF(false);
                return;
            }

            // Front
            doc.addImage(frontTemplate, "PNG", 0, 0, cardWidth, cardHeight);
            doc.addImage(capturedPhoto!, "JPEG", 5.5, 20.5, 19.7, 23.1);

            doc.setFontSize(3.5);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 0, 0);
            const textX = 27; let textY = 23; const lineHeight = 3.8;
            const infoLines = [
                `NAME: ${currentStudent.name}`, `MATRIC NO.: ${currentStudent.matric}`,
                `FACULTY: ${currentStudent.faculty}`, `DEPT: ${currentStudent.department}`,
                `EXPIRY DATE: ${currentStudent.graduationDate}`,
            ];
            
            infoLines.forEach((line, i) => {
                const maxWidth = cardWidth - textX - 5;
                const lines = doc.splitTextToSize(line, maxWidth);
                if (lines.length > 1) {
                    lines.forEach((lineText: string, lineIndex: number) => {
                        doc.text(lineText, textX, (textY + i * lineHeight) + (lineIndex * 1.5));
                    });
                } else {
                    doc.text(line, textX, textY + i * lineHeight);
                }
            });

            // Back
            if (backTemplate) {
                doc.addPage([cardWidth, cardHeight], "landscape");
                doc.addImage(backTemplate, "PNG", 0, 0, cardWidth, cardHeight);

                // Add Back Text
                const backDescription = idCardSettings?.backDescription || "The holder whose name and photograph appear on this I.D. Card is a bonafide student of the University of Port Harcourt";
                const backDisclaimer = idCardSettings?.backDisclaimer || "If found please return to the office of the Chief Security Officer University of Port Harcourt";

                doc.setTextColor(15, 23, 42); // slate-900 equivalent
                
                // Description
                doc.setFontSize(3.5);
                doc.setFont("helvetica", "bold");
                const descLines = doc.splitTextToSize(backDescription, cardWidth - 20);
                doc.text(descLines, cardWidth / 2, 20, { align: "center" });

                // Disclaimer
                doc.setFontSize(3);
                const discLines = doc.splitTextToSize(backDisclaimer, cardWidth - 20);
                doc.text(discLines, cardWidth / 2, 30, { align: "center" });

                // Signature
                const sigSrc = idCardSettings?.signature;
                if (sigSrc) {
                    const signatureImg = await loadImage(sigSrc);
                    if (signatureImg) {
                        doc.addImage(signatureImg, "PNG", (cardWidth / 2) - 15, cardHeight - 18, 30, 6, undefined, 'FAST');
                    }
                }

                // Signature Line and Label
                doc.setDrawColor(15, 23, 42);
                doc.setLineWidth(0.2);
                doc.line((cardWidth / 2) - 15, cardHeight - 11, (cardWidth / 2) + 15, cardHeight - 11);
                
                doc.setFontSize(2.5);
                doc.text("Department Admin's Signature", cardWidth / 2, cardHeight - 8, { align: "center" });
            }

            doc.save(`${currentStudent.name.replace(/\s+/g, "_")}_ID_Card.pdf`);
            toaster.success({ title: "ID Card PDF generated!" });
            setTimeout(() => { setShowModal(false); setCapturedPhoto(null); stopCamera(); }, 1000);
        } catch (err) {
            console.error("PDF generation error:", err);
            toaster.error({ title: "Failed to generate PDF" });
        } finally {
            setGeneratingPDF(false);
        }
    };

    // Bulk downloads
    const handleBulkDownloadIDCards = async () => {
        if (selectedIds.length === 0) return;
        let toastId;
        try {
            toastId = toaster.create({ title: "Downloading ID Cards...", type: "loading" });
            const templateResponse = await IDCardServices.getDefaultIDCard();
            const templateId = templateResponse?.template?.id;
            if (!templateId) { 
                if (toastId) toaster.dismiss(toastId);
                toaster.error({ title: "No default template found" }); 
                return; 
            }
            const blob = await IDCardServices.bulkDownloadIDCards(selectedIds, templateId);
            const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
            const link = document.createElement("a"); link.href = url; link.download = "ID_Cards.pdf";
            document.body.appendChild(link); link.click(); link.remove();
            
            if (toastId) toaster.dismiss(toastId);
            toaster.success({ title: "Download started" });
            setSelectedIds([]);
        } catch (err) { 
            if (toastId) toaster.dismiss(toastId);
            toaster.error({ title: "Failed to download" }); 
        }
    };

    const handleBulkDownloadBanner = async () => {
        if (selectedIds.length === 0) return;
        let toastId;
        try {
            toastId = toaster.create({ title: "Downloading Banner...", type: "loading" });
            const blob = await IDCardServices.bulkDownloadBanner(selectedIds);
            const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
            const link = document.createElement("a"); link.href = url; link.download = "Banners.pdf";
            document.body.appendChild(link); link.click(); link.remove();
            
            if (toastId) toaster.dismiss(toastId);
            toaster.success({ title: "Download started" });
            setSelectedIds([]);
        } catch (err) { 
            if (toastId) toaster.dismiss(toastId);
            toaster.error({ title: "Failed to download" }); 
        }
    };

    // Export
    const handleExportStudents = () => {
        exportToExcel(students.map((s) => ({
            "Student Name": s.name, "Matric No": s.matric, "Department": s.department,
            "Faculty": s.faculty, "Level": s.level, "ID Card Fee Paid": s.hasPaidIDCardFee ? "Yes" : "No",
        })), "Students_List", "Students");
        toaster.success({ title: "Exporting students table to Excel..." });
    };

    const selectStyle: React.CSSProperties = {
        padding: "10px 16px", border: "1px solid #e2e8f0", background: "#f1f5f9",
        borderRadius: "12px", fontSize: "14px", fontWeight: 500, color: "#475569", outline: "none",
    };

    return (
        <Box maxW="1400px" mx="auto" overflowX="hidden"> {/* Prevent page from scrolling horizontally */}
            {/* Header */}
            <Flex justifyContent="space-between" alignItems="center" mb="8" flexWrap="wrap" gap="4">
                <Box>
                    <Text fontSize="2xl" fontWeight="bold" color="slate.900">Student ID Issuance</Text>
                    <Text fontSize="sm" color="slate.500">Capture photos and generate official department ID cards.</Text>
                </Box>
                <Flex gap="3" alignItems="center" flexWrap="wrap" w={{ base: "100%", lg: "auto" }}>
                    <Box flex={{ base: "1 1 45%", lg: "none" }}>
                        <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="idcard-filter-input" style={{ ...selectStyle, width: "100%" }}>
                            <option value="all">All Levels</option>
                            {uniqueLevels.map((l) => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </Box>
                    <Box flex={{ base: "1 1 45%", lg: "none" }}>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="idcard-filter-input" style={{ ...selectStyle, width: "100%" }}>
                            <option value="all">All Status</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                        </select>
                    </Box>
                    <Box flex={{ base: "1 1 100%", lg: "none" }} position="relative" w={{ base: "100%", lg: "320px" }}>
                        <input
                            type="text" placeholder="Search by name or matric number..." value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="idcard-filter-input"
                            style={{ width: "100%", padding: "10px 16px 10px 40px", border: "1px solid #e2e8f0", background: "white", borderRadius: "12px", fontSize: "14px", outline: "none", color: "#334155" }}
                        />
                        <Search size={18} color="#94a3b8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                    </Box>
                </Flex>
            </Flex>

            {/* Table Container */}
            <Box bg="white" borderRadius="2xl" border="1px solid" borderColor="slate.100" boxShadow="sm" overflow="hidden">
                {/* Table Header (Fixed - Not Scrolling) */}
                <Flex p={{ base: "4", md: "6" }} alignItems="center" justifyContent="space-between" borderBottom="1px solid" borderColor="slate.100" flexWrap="wrap" gap="4">
                    <Text fontSize="lg" fontWeight="bold" color="slate.800">Students ({allFiltered.length})</Text>
                    <Button onClick={handleExportStudents} 
                        display="flex" alignItems="center" gap="6px" padding="6px 10px" background="white" border="1px solid #e2e8f0" borderRadius="12px" fontSize="12px" fontWeight="600" color="#475569" cursor="pointer" _hover={{ background: "#f8f9faff" }}>
                        <Download size={12} color="#94a3b8" /> Export Table
                    </Button>
                </Flex>

                {/* Scrollable Table Area - Only the table scrolls horizontally */}
                <Box overflowX="auto" overflowY="visible" w="100%">
                    <Table.Root w="full" textAlign="left" minW="800px">
                        <Table.Header bg="slate.50">
                            <Table.Row>
                                <Table.ColumnHeader px="6" py="4" w="12" textAlign="center" whiteSpace="nowrap" fontSize="11px" textTransform="uppercase" fontWeight="bold" color="slate.500" letterSpacing="wider"><input type="checkbox" checked={paginatedStudents.length > 0 && selectedIds.length === paginatedStudents.length} onChange={toggleSelectAll} /></Table.ColumnHeader>
                                <Table.ColumnHeader px="6" py="4" whiteSpace="nowrap" fontSize="11px" textTransform="uppercase" fontWeight="bold" color="slate.500" letterSpacing="wider">Student Name</Table.ColumnHeader>
                                <Table.ColumnHeader px="6" py="4" whiteSpace="nowrap" fontSize="11px" textTransform="uppercase" fontWeight="bold" color="slate.500" letterSpacing="wider">Matric No</Table.ColumnHeader>
                                <Table.ColumnHeader px="6" py="4" whiteSpace="nowrap" fontSize="11px" textTransform="uppercase" fontWeight="bold" color="slate.500" letterSpacing="wider">Department</Table.ColumnHeader>
                                <Table.ColumnHeader px="6" py="4" whiteSpace="nowrap" fontSize="11px" textTransform="uppercase" fontWeight="bold" color="slate.500" letterSpacing="wider">Level</Table.ColumnHeader>
                                <Table.ColumnHeader px="6" py="4" textAlign="center" whiteSpace="nowrap" fontSize="11px" textTransform="uppercase" fontWeight="bold" color="slate.500" letterSpacing="wider">Status</Table.ColumnHeader>
                                <Table.ColumnHeader px="6" py="4" textAlign="center" whiteSpace="nowrap" fontSize="11px" textTransform="uppercase" fontWeight="bold" color="slate.500" letterSpacing="wider">Action</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body fontSize="sm">
                            {loading ? (
                                <Table.Row><Table.Cell colSpan={7} py="12" px="6" textAlign="center">
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "#64748b" }}>
                                        <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
                                        <span style={{ fontSize: "14px", fontWeight: 500 }}>Fetching students…</span>
                                    </div>
                                </Table.Cell></Table.Row>
                            ) : paginatedStudents.length === 0 ? (
                                <Table.Row><Table.Cell colSpan={7} py="12" px="6">
                                    <EmptyState.Root>
                                        <EmptyState.Content>
                                            <EmptyState.Indicator>
                                                <IdCard />
                                            </EmptyState.Indicator>
                                            <EmptyState.Title>
                                                {statusFilter === "all" ? "No Students Found" : `No ${statusFilter} students found`}
                                            </EmptyState.Title>
                                            <EmptyState.Description>
                                                Try adjusting your search or filter criteria
                                            </EmptyState.Description>
                                        </EmptyState.Content>
                                    </EmptyState.Root>
                                </Table.Cell></Table.Row>
                            ) : paginatedStudents.map((s) => (
                                <Table.Row
                                    key={s.id}
                                    _hover={{ bg: "slate.50" }}
                                    borderBottom="1px solid" borderColor="slate.50" color="slate.600"
                                    bg={selectedIds.includes(s.id) ? "blue.50" : "transparent"}
                                    cursor="pointer"
                                    onClick={() => toggleSelection(s.id)}
                                    transition="background 0.2s"
                                >
                                    <Table.Cell px="6" py="4" textAlign="center" whiteSpace="nowrap" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                        <input type="checkbox" checked={selectedIds.includes(s.id)} onChange={() => toggleSelection(s.id)} />
                                    </Table.Cell>
                                    <Table.Cell px="6" py="4" fontWeight="bold" color="slate.700" whiteSpace="nowrap">{s.name}</Table.Cell>
                                    <Table.Cell px="6" py="4" color="slate.500" whiteSpace="nowrap">{s.matric}</Table.Cell>
                                    <Table.Cell px="6" py="4" color="slate.500" whiteSpace="nowrap">{s.department}</Table.Cell>
                                    <Table.Cell px="6" py="4" color="slate.500" whiteSpace="nowrap">{s.level}</Table.Cell>
                                    <Table.Cell px="6" py="4" textAlign="center" whiteSpace="nowrap">
                                        <Text as="span" px="3" py="1" borderRadius="full" fontSize="10px" fontWeight="bold"
                                            bg={s.hasPaidIDCardFee ? "green.100" : "red.100"}
                                            color={s.hasPaidIDCardFee ? "green.700" : "red.700"}
                                        >
                                            {s.hasPaidIDCardFee ? "FEE PAID" : "UNPAID"}
                                        </Text>
                                    </Table.Cell>
                                    <Table.Cell px="6" py="4" textAlign="center" whiteSpace="nowrap" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                        <button
                                            onClick={() => handleIssueCard(s)}
                                            disabled={!s.hasPaidIDCardFee}
                                            style={{
                                                background: "none", border: "none", fontWeight: 700, cursor: s.hasPaidIDCardFee ? "pointer" : "not-allowed",
                                                color: s.hasPaidIDCardFee ? "#2563eb" : "#cbd5e1", fontSize: "14px",
                                                textDecoration: "none",
                                            }}
                                            onMouseEnter={(e) => { if (s.hasPaidIDCardFee) (e.target as HTMLElement).style.textDecoration = "underline"; }}
                                            onMouseLeave={(e) => { (e.target as HTMLElement).style.textDecoration = "none"; }}
                                        >
                                            Issue Card
                                        </button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderTop: "1px solid #e5e7eb", background: "white", borderRadius: "0 0 16px 16px" }}>
                    <div style={{ fontSize: "14px", color: "#64748b" }}>
                        Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, allFiltered.length)} of {allFiltered.length} students
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: 700, border: "none", cursor: currentPage === 1 ? "not-allowed" : "pointer", background: "#f1f5f9", color: currentPage === 1 ? "#94a3b8" : "#334155" }}
                        >
                            Previous
                        </button>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum: number;
                                if (totalPages <= 5) pageNum = i + 1;
                                else if (currentPage <= 3) pageNum = i + 1;
                                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                else pageNum = currentPage - 2 + i;
                                return (
                                    <button key={pageNum} onClick={() => setCurrentPage(pageNum)} style={{
                                        width: "40px", height: "40px", borderRadius: "8px", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer",
                                        background: currentPage === pageNum ? "#1D7AD9" : "#f1f5f9",
                                        color: currentPage === pageNum ? "white" : "#334155",
                                    }}>
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: 700, border: "none", cursor: currentPage === totalPages ? "not-allowed" : "pointer", background: "#f1f5f9", color: currentPage === totalPages ? "#94a3b8" : "#334155" }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Camera/Generate Modal */}
            {showModal && currentStudent && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                    <div style={{ background: "white", borderRadius: "24px", width: "100%", maxWidth: "672px", boxShadow: "0 24px 48px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
                        {/* Modal Header */}
                        <div style={{ padding: "16px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3 style={{ fontWeight: 700, color: "#1e293b", fontSize: "16px", margin: 0, wordBreak: "break-word" }}>
                                Capture & Issue: {currentStudent.name}
                            </h3>
                            <button onClick={() => { setShowModal(false); stopCamera(); setCapturedPhoto(null); }} style={{ padding: "8px", background: "none", border: "none", cursor: "pointer", borderRadius: "50%", color: "#64748b" }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: "24px", overflowY: "auto" }}>
                            {/* Camera Area */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                                <div style={{ width: "100%", aspectRatio: "16/9", background: "#0f172a", borderRadius: "16px", overflow: "hidden", position: "relative", border: "4px solid #f1f5f9" }}>
                                    {!capturedPhoto ? (
                                        <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        <img src={capturedPhoto} style={{ width: "100%", height: "100%", objectFit: "fill" }} alt="Captured student photo" />
                                    )}
                                </div>

                                {!capturedPhoto ? (
                                    <Flex gap="12px" w="100%" direction={{ base: "column", sm: "row" }}>
                                        <button onClick={captureImage} style={{ flex: 1, background: "#2563eb", color: "white", padding: "12px", borderRadius: "12px", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "none", cursor: "pointer", opacity: !cameraActive ? 0.5 : 1 }}>
                                            <Camera size={18} /> Capture Photo
                                        </button>
                                        <label style={{ flex: 1, background: "#f1f5f9", color: "#334155", padding: "12px", borderRadius: "12px", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer" }}>
                                            <Upload size={18} /> Upload Image (≤ 5MB)
                                            <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} style={{ display: "none" }} />
                                        </label>
                                    </Flex>
                                ) : (
                                    <button onClick={() => { setCapturedPhoto(null); startCamera(); }} style={{ width: "100%", background: "#f1f5f9", color: "#475569", padding: "12px", borderRadius: "12px", fontWeight: 700, fontSize: "14px", border: "none", cursor: "pointer" }}>
                                        Retake Photo
                                    </button>
                                )}
                            </div>

                            {/* ID Preview Section */}
                            {capturedPhoto && (
                                <div style={{ marginTop: "32px" }}>
                                    <h4 style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>
                                        ID Card Preview
                                    </h4>
                                    <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="16px">
                                        {/* Front View */}
                                        <div style={{ position: "relative", aspectRatio: "400/250", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                                            <img src={idCardSettings?.frontTemplate || "/departmental-admin/idcard-front.png"} style={{ width: "100%", height: "100%" }} alt="Front template" />
                                            <img src={capturedPhoto} style={{ position: "absolute", top: "38%", left: "6.5%", width: "23%", height: "43%", objectFit: "cover", border: "1px solid white" }} alt="Student" />
                                            <div style={{ position: "absolute", left: "32%", top: "42.5%", width: "45%", fontSize: "7px", fontWeight: 700, color: "black", textTransform: "uppercase" }}>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "8.5px", lineHeight: 1 }}>
                                                    <div>NAME: {currentStudent.name}</div>
                                                    <div>MATRIC NO.: {currentStudent.matric}</div>
                                                    <div>FACULTY: {currentStudent.faculty}</div>
                                                    <div>DEPT: {currentStudent.department}</div>
                                                    <div>EXPIRY DATE: {currentStudent.graduationDate}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Back View */}
                                        <div style={{ position: "relative", aspectRatio: "400/250", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                                            <img src={idCardSettings?.backTemplate || "/departmental-admin/idcard-back.png"} style={{ width: "100%", height: "100%" }} alt="Back template" />
                                            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "40px", textAlign: "center", padding: "40px 24px 0" }}>
                                                <p style={{ fontSize: "9px", fontWeight: 700, color: "#0f172a", marginBottom: "8px", lineHeight: 1.2, maxWidth: "95%", margin: "0 0 8px" }}>
                                                    {idCardSettings?.backDescription || "The holder whose name and photograph appear on this I.D. Card is a bonafide student of the University of Port Harcourt"}
                                                </p>
                                                <p style={{ fontSize: "8px", fontWeight: 700, color: "#0f172a", lineHeight: 1.2, maxWidth: "95%", margin: 0 }}>
                                                    {idCardSettings?.backDisclaimer || "If found please return to the office of the Chief Security Officer University of Port Harcourt"}
                                                </p>

                                                <div style={{ marginTop: "auto", marginBottom: "24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                    {idCardSettings?.signature && (
                                                        <img src={idCardSettings.signature} alt="Signature" style={{ width: "176px", height: "28px", marginBottom: 0, objectFit: "contain" }} />
                                                    )}
                                                    <div style={{ width: "160px", height: "1.5px", background: "#0f172a", marginBottom: "4px" }} />
                                                    <p style={{ fontSize: "7px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Department Admin's Signature</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Box>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div style={{ padding: "24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", gap: "16px" }}>
                            <button
                                onClick={generateIDCardPDF}
                                disabled={!capturedPhoto || uploadingPhoto || generatingPDF}
                                style={{
                                    flex: 1, background: "#16a34a", color: "white", padding: "14px", borderRadius: "12px", fontWeight: 700, fontSize: "14px",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                    border: "none", cursor: (!capturedPhoto || uploadingPhoto || generatingPDF) ? "not-allowed" : "pointer",
                                    opacity: (!capturedPhoto || uploadingPhoto || generatingPDF) ? 0.5 : 1,
                                    boxShadow: "0 4px 12px rgba(22,163,74,0.2)",
                                }}
                            >
                                {generatingPDF ? (
                                    <><Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Generating PDF...</>
                                ) : uploadingPhoto ? (
                                    <><Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Uploading...</>
                                ) : (
                                    <><Download size={20} /> Generate ID Card PDF</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Action Bar */}
            {selectedIds.length > 1 && (
                <Flex position="fixed" bottom={{ base: "4", md: "8" }} left="50%" transform="translateX(-50%)" bg="white" px={{ base: "4", md: "6" }} py={{ base: "3", md: "3" }} borderRadius="xl" boxShadow="2xl" border="1px solid" borderColor="gray.100" alignItems="center" gap={{ base: "3", md: "6" }} zIndex="50" w={{ base: "calc(100% - 32px)", md: "auto" }} flexWrap={{ base: "wrap", md: "nowrap" }} justifyContent="center">
                    <Text fontSize="sm" fontWeight="bold" color="slate.700" whiteSpace="nowrap">{selectedIds.length} items</Text>
                    <Box w="px" h="6" bg="slate.200" display={{ base: "none", md: "block" }} />
                    <Box as="button" onClick={handleBulkDownloadBanner} display="flex" alignItems="center" justifyContent="center" gap="2" bg="#1D7AD9" color="white" px="4" py="2" borderRadius="lg" fontSize="xs" fontWeight="bold" cursor="pointer" _hover={{ bg: "blue.700" }} border="none" flex={{ base: "1", md: "none" }}>
                        <Download size={16} /> <Text as="span" display={{ base: "none", sm: "inline" }}>Bulk Download Banner</Text><Text as="span" display={{ base: "inline", sm: "none" }}>Banners</Text>
                    </Box>
                    <Box as="button" onClick={handleBulkDownloadIDCards} display="flex" alignItems="center" justifyContent="center" gap="2" bg="#1D7AD9" color="white" px="4" py="2" borderRadius="lg" fontSize="xs" fontWeight="bold" cursor="pointer" _hover={{ bg: "blue.700" }} border="none" flex={{ base: "1", md: "none" }}>
                        <Download size={16} /> <Text as="span" display={{ base: "none", sm: "inline" }}>Bulk Download ID-Cards</Text><Text as="span" display={{ base: "inline", sm: "none" }}>IDs</Text>
                    </Box>
                </Flex>
            )}

            {/* Hidden Canvas */}
            <canvas ref={canvasRef} style={{ display: "none" }} width={640} height={480} />
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .idcard-filter-input:focus { box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2) !important; border-color: #93c5fd !important; }
            `}</style>
        </Box>
    );
};

export default IDCardPage;