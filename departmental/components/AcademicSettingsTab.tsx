import React, { useState } from "react";
import { Plus, Loader2, GraduationCap } from "lucide-react";
import FormFieldHorizontal from "./FormFieldHorizontal";
import { programsCoursesApi } from "../api/programscourseapi";
import { toast } from "react-hot-toast";

export const AcademicSettingsTab: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "UNDERGRADUATE",
    description: "",
  });

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData({ name: "", code: "", type: "UNDERGRADUATE", description: "" });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.code) {
      toast.error("Please fill in required fields (Name and Code)");
      return;
    }

    try {
      setIsSaving(true);
      await programsCoursesApi.createProgramType(formData);
      toast.success("Program Type created successfully");
      handleCancel();
    } catch (error: any) {
      console.error("Failed to create program type", error);
      toast.error(error.response?.data?.message || "Failed to create program type");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Create Program Type Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <GraduationCap size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Create Program Type</h3>
            <p className="text-sm text-slate-500">Add a new program type to the system (e.g., Bachelor of Science, Master of Arts)</p>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-6">
            <div className="space-y-6">
              <FormFieldHorizontal
                label="Name"
                value={formData.name}
                onChange={(val) => handleFormChange("name", val)}
                placeholder="e.g. Bachelor of Science"
              />
              <FormFieldHorizontal
                label="Code"
                value={formData.code}
                onChange={(val) => handleFormChange("code", val)}
                placeholder="e.g. BSC"
              />
            </div>

            <div className="space-y-6">
              <FormFieldHorizontal
                label="Type"
                type="select"
                options={[
                  { label: "Undergraduate", value: "UNDERGRADUATE" },
                  { label: "Post-Graduate", value: "POST-GRADUATE" },
                  { label: "Diploma", value: "DIPLOMA" },
                  { label: "Certificate", value: "CERTIFICATE" },
                ]}
                value={formData.type}
                onChange={(val) => handleFormChange("type", val)}
              />
              <FormFieldHorizontal
                label="Description"
                type="textarea"
                value={formData.description}
                onChange={(val) => handleFormChange("description", val)}
                placeholder="Optional description for this program type"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={handleCancel}
              className="px-8 py-2.5 rounded-lg text-sm font-medium border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-2.5 rounded-lg text-sm font-bold bg-[#00B01D] text-white hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Create Program Type
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <div className="bg-blue-100 p-1.5 rounded-full mt-0.5">
          <GraduationCap size={14} className="text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-blue-800 font-medium">Note</p>
          <p className="text-sm text-blue-700">
            Program types are typically created once during initial setup. To view and manage existing program types, 
            go to <span className="font-semibold">Program & Courses → Program Types</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
