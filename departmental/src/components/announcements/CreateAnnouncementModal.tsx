import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { AnnouncementServices } from "@services/announcement.service";
import { toaster } from "@components/ui/toaster";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreated: () => void;
}

const CreateAnnouncementModal = ({ isOpen, onClose, onCreated }: Props) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [recipients, setRecipients] = useState<{ student: boolean; staff: boolean }>({
        student: false,
        staff: false,
    });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!title.trim()) {
            toaster.error({ title: "Please enter a title" });
            return;
        }
        if (!recipients.student && !recipients.staff) {
            toaster.error({ title: "Please select at least one recipient" });
            return;
        }
        if (!description.trim()) {
            toaster.error({ title: "Please enter a description" });
            return;
        }

        setLoading(true);
        try {
            const isForValues: string[] = [];
            if (recipients.student) isForValues.push("STUDENT");
            if (recipients.staff) isForValues.push("OTHERS");

            await Promise.all(
                isForValues.map((isFor) =>
                    AnnouncementServices.createAnnouncement({
                        title: title.toUpperCase(),
                        body: description,
                        isFor,
                    })
                )
            );

            toaster.success({ title: "Announcement created successfully" });
            onCreated();
            onClose();
            setTitle("");
            setDescription("");
            setRecipients({ student: false, staff: false });
        } catch (error) {
            console.error("Failed to create announcement:", error);
            toaster.error({ title: "Failed to create announcement" });
        } finally {
            setLoading(false);
        }
    };

    const toggleRecipient = (type: "student" | "staff") => {
        setRecipients((prev) => ({ ...prev, [type]: !prev[type] }));
    };

    const getSelectedText = () => {
        const selected = [];
        if (recipients.student) selected.push("Student");
        if (recipients.staff) selected.push("Staff");
        if (selected.length === 0) return "Select Recipient(s)";
        if (selected.length <= 2) return selected.join(", ");
        return `${selected.length} Selected`;
    };

    const inputStyle: React.CSSProperties = {
        width: "100%", padding: "12px 16px", background: "white", border: "1px solid #cbd5e1",
        borderRadius: "12px", fontSize: "14px", color: "#334155", outline: "none",
    };

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
        }}>
            <div style={{
                background: "white", borderRadius: "24px", width: "100%", maxWidth: "672px",
                maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 48px rgba(0,0,0,0.12)",
            }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 32px", borderBottom: "1px solid #f1f5f9" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1D7AD9", margin: 0 }}>Create New Announcement</h2>
                    <button onClick={onClose} style={{ padding: "8px", color: "#94a3b8", background: "none", border: "none", cursor: "pointer", borderRadius: "50%" }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
                    {/* Title Input */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
                            Title <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Announcement Title"
                            className="create-ann-input"
                            style={inputStyle}
                        />
                    </div>

                    {/* Recipients Dropdown */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", position: "relative" }}>
                        <label style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
                            Recipient(s) <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="create-ann-input"
                            style={{
                                ...inputStyle, textAlign: "left", display: "flex", alignItems: "center",
                                justifyContent: "space-between", cursor: "pointer",
                            }}
                        >
                            <span style={{ color: !Object.values(recipients).some(Boolean) ? "#94a3b8" : "#334155" }}>
                                {getSelectedText()}
                            </span>
                            <svg
                                style={{ width: "20px", height: "20px", color: "#94a3b8", transition: "transform 0.2s", transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0)" }}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div style={{
                                position: "absolute", zIndex: 10, width: "100%", top: "100%", marginTop: "8px",
                                background: "white", border: "1px solid #f1f5f9", borderRadius: "12px",
                                boxShadow: "0 12px 36px rgba(0,0,0,0.1)", padding: "8px 0",
                            }}>
                                <label style={{ display: "flex", alignItems: "center", padding: "12px 16px", cursor: "pointer" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                    <input type="checkbox" checked={recipients.student} onChange={() => toggleRecipient("student")}
                                        style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "#1D7AD9" }} />
                                    <span style={{ marginLeft: "12px", fontSize: "14px", fontWeight: 500, color: "#334155" }}>Student</span>
                                </label>
                                <label style={{ display: "flex", alignItems: "center", padding: "12px 16px", cursor: "pointer" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                    <input type="checkbox" checked={recipients.staff} onChange={() => toggleRecipient("staff")}
                                        style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "#1D7AD9" }} />
                                    <span style={{ marginLeft: "12px", fontSize: "14px", fontWeight: 500, color: "#334155" }}>Staff</span>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Description Textarea */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
                            Description <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe announcement in details"
                            rows={6}
                            className="create-ann-input"
                            style={{ ...inputStyle, resize: "none", fontFamily: "inherit" }}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: "24px 32px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px" }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "12px 32px", background: "#f1f5f9", border: "1px solid #f1f5f9",
                            color: "#0f172a", fontWeight: 700, borderRadius: "8px", fontSize: "14px", cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !title || !description || !Object.values(recipients).some(Boolean)}
                        style={{
                            padding: "12px 32px", background: "#1D7AD9", border: "none",
                            color: "white", fontWeight: 700, borderRadius: "8px", fontSize: "14px",
                            cursor: (loading || !title || !description || !Object.values(recipients).some(Boolean)) ? "not-allowed" : "pointer",
                            opacity: (loading || !title || !description || !Object.values(recipients).some(Boolean)) ? 0.7 : 1,
                            display: "flex", alignItems: "center", gap: "8px",
                        }}
                    >
                        {loading && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
                        Create Announcement
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .create-ann-input:focus { box-shadow: 0 0 0 3px rgba(29, 122, 217, 0.2) !important; border-color: #1D7AD9 !important; }
            `}</style>
        </div>
    );
};

export default CreateAnnouncementModal;
