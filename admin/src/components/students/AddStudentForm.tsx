import { useState } from "react";
import { X, Loader2 } from "lucide-react";

interface AddStudentFormProps {
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    initialData?: any;
}

const FormField = ({ label, name, placeholder, value, onChange }: {
    label: string; name: string; placeholder: string; value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={{ fontSize: "14px", fontWeight: 500, color: "#334155" }}>{label}</label>
        <input
            type="text" name={name} value={value} onChange={onChange} placeholder={placeholder}
            style={{
                width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1",
                color: "#334155", fontSize: "14px", outline: "none", background: "white",
            }}
        />
    </div>
);

const AddStudentForm = ({ onClose, onSubmit, initialData }: AddStudentFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        regNo: initialData?.regNo || "",
        matNo: initialData?.matNo || "",
        firstName: initialData?.surname || "",
        otherName: initialData?.otherNames || "",
        gender: initialData?.sex || "",
        level: initialData?.level || "",
        admissionMode: initialData?.admissionMode || "",
        entryQualification: initialData?.entryQualification || "",
        facultyName: initialData?.faculty || "",
        degreeCourse: initialData?.degreeCourse || "",
        departmentName: initialData?.department || "",
        degreeAwarded: initialData?.degreeAwardCode || "",
        courseDuration: initialData?.programDuration || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)",
            zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
        }}>
            <div style={{
                background: "white", borderRadius: "16px", width: "100%", maxWidth: "896px",
                boxShadow: "0 24px 48px rgba(0,0,0,0.12)", maxHeight: "90vh", overflowY: "auto",
            }}>
                <div style={{ padding: "32px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
                        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1273D4", margin: 0 }}>
                            {initialData ? "Edit Student" : "Add Student"}
                        </h2>
                        <button onClick={onClose} style={{ padding: "8px", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", borderRadius: "8px" }}>
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px 32px" }}>
                            <FormField label="Reg No." name="regNo" placeholder="202440965974BA" value={formData.regNo} onChange={handleChange} />
                            <FormField label="Mat No." name="matNo" placeholder="U2024/5570001" value={formData.matNo} onChange={handleChange} />
                            <FormField label="First Name" name="firstName" placeholder="DEEZIA" value={formData.firstName} onChange={handleChange} />
                            <FormField label="Other Name" name="otherName" placeholder="GOODLUCK BLEEBEST" value={formData.otherName} onChange={handleChange} />
                            <FormField label="Gender" name="gender" placeholder="Male" value={formData.gender} onChange={handleChange} />
                            <FormField label="Level" name="level" placeholder="100" value={formData.level} onChange={handleChange} />
                            <FormField label="Admission Mode" name="admissionMode" placeholder="UTME" value={formData.admissionMode} onChange={handleChange} />
                            <FormField label="Entry Qualification" name="entryQualification" placeholder="O-LEVEL" value={formData.entryQualification} onChange={handleChange} />
                            <FormField label="Faculty Name" name="facultyName" placeholder="COMPUTING" value={formData.facultyName} onChange={handleChange} />
                            <FormField label="Degree Course" name="degreeCourse" placeholder="COMPUTER SCIENCE" value={formData.degreeCourse} onChange={handleChange} />
                            <FormField label="Department Name" name="departmentName" placeholder="COMPUTER SCIENCE" value={formData.departmentName} onChange={handleChange} />
                            <FormField label="Degree Awarded" name="degreeAwarded" placeholder="B.SC" value={formData.degreeAwarded} onChange={handleChange} />
                            <FormField label="Course Duration" name="courseDuration" placeholder="4" value={formData.courseDuration} onChange={handleChange} />
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", marginTop: "48px", paddingTop: "16px" }}>
                            <button type="button" onClick={onClose} style={{
                                padding: "12px 32px", borderRadius: "8px", border: "1px solid #cbd5e1",
                                color: "#334155", fontWeight: 700, cursor: "pointer", background: "white", fontSize: "14px",
                            }}>
                                Cancel
                            </button>
                            <button type="submit" disabled={isSubmitting} style={{
                                padding: "12px 32px", borderRadius: "8px", border: "none",
                                background: "#1273D4", color: "white", fontWeight: 700, cursor: isSubmitting ? "not-allowed" : "pointer",
                                boxShadow: "0 4px 12px rgba(18,115,212,0.2)", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px",
                            }}>
                                {isSubmitting && <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />}
                                {initialData ? "Save Changes" : "Add Student"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default AddStudentForm;
