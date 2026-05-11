import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => Promise<void>;
    title: string;
    description: string;
    itemCount: number;
}

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, description, itemCount }: DeleteConfirmationModalProps) => {
    const [reason, setReason] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        if (!reason.trim()) return;
        try {
            setIsDeleting(true);
            await onConfirm(reason);
        } catch (error) {
            console.error("Delete failed", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
        }}>
            <div style={{
                background: "white", borderRadius: "16px", boxShadow: "0 24px 48px rgba(0,0,0,0.12)",
                width: "100%", maxWidth: "448px", overflow: "hidden",
            }}>
                <div style={{ padding: "24px" }}>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                        <div style={{ height: "48px", width: "48px", borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <AlertTriangle size={24} color="#dc2626" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", margin: 0 }}>{title}</h3>
                            <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 0" }}>
                                You are about to delete <span style={{ fontWeight: 700, color: "#0f172a" }}>{itemCount}</span> items.
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <p style={{ color: "#475569", marginBottom: "24px", fontSize: "14px", lineHeight: 1.6 }}>{description}</p>

                    {/* Reason textarea */}
                    <div style={{ marginBottom: "24px" }}>
                        <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Reason for deletion <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g. Students graduated and left the university"
                            autoFocus
                            style={{
                                width: "100%", padding: "12px", fontSize: "14px", border: "1px solid #e2e8f0", borderRadius: "8px",
                                outline: "none", minHeight: "100px", resize: "none", marginTop: "8px",
                                color: "#334155", fontFamily: "inherit",
                            }}
                        />
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "flex-end" }}>
                        <button onClick={onClose} disabled={isDeleting} style={{
                            padding: "10px 16px", fontSize: "14px", fontWeight: 700, color: "#475569",
                            background: "none", border: "none", cursor: "pointer", borderRadius: "8px",
                        }}>
                            Cancel
                        </button>
                        <button onClick={handleConfirm} disabled={!reason.trim() || isDeleting} style={{
                            padding: "10px 24px", fontSize: "14px", fontWeight: 700, color: "white",
                            background: (!reason.trim() || isDeleting) ? "#fca5a5" : "#dc2626", border: "none",
                            borderRadius: "8px", boxShadow: "0 4px 12px rgba(220,38,38,0.2)", cursor: (!reason.trim() || isDeleting) ? "not-allowed" : "pointer",
                            display: "flex", alignItems: "center", gap: "8px",
                        }}>
                            {isDeleting ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : null}
                            {isDeleting ? "Deleting..." : "Delete Permanently"}
                        </button>
                        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
