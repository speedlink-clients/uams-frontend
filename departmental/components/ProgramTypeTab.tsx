import React, { useState, useEffect } from "react";
import { Filter, Search, Edit, Trash2, Plus, MoreHorizontal } from "lucide-react";
import FormFieldHorizontal from "./FormFieldHorizontal";
import { programsCoursesApi } from "../api/programscourseapi";
import { ProgramTypeResponse } from "../api/types";
import { toast } from "react-hot-toast";

const ProgramTypeTab: React.FC = () => {
  const [programTypes, setProgramTypes] = useState<ProgramTypeResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "UNDERGRADUATE",
    description: "",
  });

  useEffect(() => {
    fetchProgramTypes();
  }, []);

  const fetchProgramTypes = async () => {
    try {
      setIsLoading(true);
      const data = await programsCoursesApi.getProgramTypes();
      setProgramTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch program types", error);
      toast.error("Failed to load program types");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.code) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      setIsSaving(true);
      await programsCoursesApi.createProgramType(formData);
      toast.success("Program Type created successfully");
      setIsCreating(false);
      setFormData({ name: "", code: "", type: "UNDERGRADUATE", description: "" });
      fetchProgramTypes();
    } catch (error: any) {
      console.error("Failed to create program type", error);
      toast.error(error.response?.data?.message || "Failed to create program type");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this program type?")) {
      try {
        await programsCoursesApi.deleteProgramType(id);
        toast.success("Program Type deleted");
        fetchProgramTypes();
      } catch (error: any) {
        console.error("Failed to delete program type", error);
        toast.error(error.response?.data?.message || "Failed to delete program type");
      }
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === programTypes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(programTypes.map((pt) => pt.id));
    }
  };

  const filteredTypes = programTypes.filter((pt) =>
    pt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        {selectedIds.length > 0 && (
            <button
                onClick={async () => {
                    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) {
                        try {
                            await programsCoursesApi.bulkDeleteProgramTypes(selectedIds);
                            toast.success("Program Types deleted");
                            setSelectedIds([]);
                            fetchProgramTypes();
                        } catch (error: any) {
                            console.error("Failed to delete program types", error);
                            toast.error("Failed to delete program types");
                        }
                    }
                }}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-red-100 transition-colors"
            >
                <Trash2 size={16} />
                Delete Selected ({selectedIds.length})
            </button>
        )}
        <div className="flex-1 flex justify-end">
        <button
          onClick={() => setIsCreating(true)}
          className="bg-[#00B01D] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-green-500/20 hover:bg-green-700 transition-all active:scale-95"
        >
          <Plus size={18} />
          Create Program Type
        </button>
        </div>
      </div>

      {isCreating && (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-in fade-in zoom-in-95 duration-200">
          <h3 className="text-xl font-bold text-slate-800 mb-8">
            Create Program Type
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-6">
            <div className="space-y-6">
              <FormFieldHorizontal
                label="Name"
                value={formData.name}
                onChange={(val) => handleFormChange("name", val)}
                placeholder="e.g. Undergraduate"
              />
              <FormFieldHorizontal
                label="Code"
                value={formData.code}
                onChange={(val) => handleFormChange("code", val)}
                placeholder="e.g. UG"
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
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={() => setIsCreating(false)}
              className="px-8 py-2.5 rounded-lg text-sm font-medium border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-2.5 rounded-lg text-sm font-bold bg-[#00B01D] text-white hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Create Program Type"}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-800">Program Types</h3>
          <div className="flex gap-3">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search..."
                className="bg-white border border-slate-200 text-xs py-2.5 pl-4 pr-10 rounded-xl outline-none w-64 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-y border-gray-100 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                <th className="px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer"
                    checked={
                      programTypes.length > 0 &&
                      selectedIds.length === programTypes.length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredTypes.length > 0 ? (
                filteredTypes.map((pt) => (
                  <tr
                    key={pt.id}
                    className="hover:bg-slate-50/50 transition-colors text-slate-600"
                  >
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer"
                        checked={selectedIds.includes(pt.id)}
                        onChange={() => toggleSelection(pt.id)}
                      />
                    </td>
                    <td className="px-6 py-4 font-medium">{pt.name}</td>
                    <td className="px-6 py-4">{pt.type}</td>
                    <td className="px-6 py-4">{pt.code}</td>
                    <td className="px-6 py-4 truncate max-w-xs text-xs text-slate-500">
                      {pt.description || "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveActionId(
                              activeActionId === pt.id ? null : pt.id
                            )
                          }
                          className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {activeActionId === pt.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActiveActionId(null)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-1 animate-in fade-in zoom-in-95 duration-200">
                              <button
                                onClick={() => {
                                  console.log("Edit", pt.id);
                                  setActiveActionId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left"
                              >
                                <Edit size={14} />
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  handleDelete(pt.id);
                                  setActiveActionId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    {isLoading ? "Loading..." : "No program types found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProgramTypeTab;
