import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { Filter, MoreHorizontal, Search, ChevronDown, Edit, Trash2, Download, Trash, X } from "lucide-react";
import { toast } from "react-hot-toast";
import FormFieldHorizontal from "./FormFieldHorizontal";
import { programsCoursesApi } from "../api/programscourseapi";
import { academicsApi } from "../api/accademicapi";
import { ProgramTypeResponse } from "../api/types";
import { exportToExcel } from "../utils/excelExport";



interface StructureTabProps {
  isCreatingRoute?: boolean;
  isEditingRoute?: boolean;
}

const StructureTab: React.FC<StructureTabProps> = ({ isCreatingRoute, isEditingRoute }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [programTypes, setProgramTypes] = useState<ProgramTypeResponse[]>([]);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; right: number } | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const [editingSession, setEditingSession] = useState<any | null>(null);

  // Sync editingSession with route ID
  useEffect(() => {
    if (isEditingRoute && id && sessions.length > 0) {
      const session = sessions.find(sub => sub.id === id);
      if (session) {
        console.log("Editing session data:", session); // Debug log
        setEditingSession(session);
        setFormData({
          name: session.name,
          type: session.programType?.id || "",
          semesters: session.semesters || session.semesterCount?.toString() || "",
          duration: session.duration + " Months",
          startDate: session.startDate || "",
          description: session.description || session.desc || "",
        });
      }
    } else if (!isEditingRoute) {
      setEditingSession(null);
      setFormData({
        name: "",
        type: "",
        semesters: "",
        duration: "",
        startDate: "",
        description: "",
      });
    }
  }, [isEditingRoute, id, sessions]);

  // Fetch Program Types and Sessions on Mount or when route changes
  const location = useLocation();
  
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [typesData, sessionsData] = await Promise.all([
          programsCoursesApi.getProgramTypes(),
          academicsApi.getAcademicSessions()
        ]);

        console.log("Program Types:", typesData);
        console.log("Sessions Data:", sessionsData);

        // Handle Program Types (check if array or object wrapper)
        const types = Array.isArray(typesData) ? typesData : (typesData as any)?.data || [];
        setProgramTypes(types);

        // Handle Sessions (check if array or object wrapper)
        const sessionsList = Array.isArray(sessionsData) ? sessionsData : (sessionsData as any)?.data || (sessionsData as any)?.sessions || [];
        setSessions(sessionsList);

      } catch (err) {
        console.error("Failed to fetch data", err);
        toast.error("Failed to load initial data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [location.pathname]);

  // Form State
  const [formData, setFormData] = useState({
    name: "2023/2024 Academic Session",
    duration: "12 Months",
    type: "Undergraduate",
    startDate: "2024-10-12", // Fixed date format for date input
    semesters: "2",
    description: "",
  });

  // Populate form when editingSession changes
  React.useEffect(() => {
    if (editingSession) {
      setFormData({
        name: editingSession.name,
        duration: editingSession.duration,
        type: editingSession.type,
        startDate: editingSession.startDate, // Ensure format YYYY-MM-DD
        semesters: "2", // Mock data doesn't have semesters, default or mock it
        description: "", // Mock data doesn't have description
      });
    } else {
      // Reset to default
      setFormData({
        name: "2023/2024 Academic Session",
        duration: "12 Months",
        type: "Undergraduate",
        startDate: "2024-10-12",
        semesters: "2",
        description: "",
      });
    }
  }, [editingSession]);

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === sessions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sessions.map(s => s.id));
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-600"
      : "bg-gray-100 text-gray-600";
  };

  const handleSave = async () => {
    // Validate inputs?

    try {
      setIsSaving(true);
      const durationInt = parseInt(formData.duration) || 0;

      // Calculate End Date
      const startDateObj = new Date(formData.startDate);
      const endDateObj = new Date(startDateObj);
      endDateObj.setMonth(startDateObj.getMonth() + durationInt);
      const endDate = endDateObj.toISOString().split('T')[0];

      const payload = {
        ...formData,
        duration: durationInt,
        startDate: formData.startDate,
        endDate: endDate,
        semesterCount: Number(formData.semesters),
        isActive: true
      };

      if (editingSession) {
        await academicsApi.updateSession(editingSession.id, {
          name: payload.name,
          type: programTypes.find(t => t.id === payload.type)?.name || payload.type,
          semesterCount: payload.semesterCount,
          duration: payload.duration,
          startDate: payload.startDate,
          endDate: payload.endDate,
          description: payload.description,
          isActive: true
        });
        toast.success("Session updated");
      } else {
        await academicsApi.createSession(payload);
        toast.success("Session created successfully");
      }

      // Refresh list BEFORE navigating
      const updatedSessions = await academicsApi.getAcademicSessions();
      setSessions(updatedSessions);
      
      // Navigate after refresh
      navigate("/program-courses");

    } catch (error: any) {
      console.error("Failed to save session", error);
      toast.error(error.response?.data?.message || "Failed to save session");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        await academicsApi.deleteSession(id);
        toast.success("Session deleted");

        // Refresh list
        const updatedSessions = await academicsApi.getAcademicSessions();
        const sessionsList = Array.isArray(updatedSessions) ? updatedSessions : (updatedSessions as any)?.data || (updatedSessions as any)?.sessions || [];
        setSessions(sessionsList);
      } catch (error: any) {
        console.error("Failed to delete session", error);
        toast.error(error.response?.data?.message || "Failed to delete session");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected sessions?`)) {
      try {
        await Promise.all(selectedIds.map(id => academicsApi.deleteSession(id)));
        toast.success(`${selectedIds.length} sessions deleted successfully`);
        setSelectedIds([]);
        // Refresh list
        const updatedSessions = await academicsApi.getAcademicSessions();
        const sessionsList = Array.isArray(updatedSessions) ? updatedSessions : (updatedSessions as any)?.data || (updatedSessions as any)?.sessions || [];
        setSessions(sessionsList);
      } catch (err: any) {
        console.error("Error bulk deleting sessions:", err);
        toast.error("Failed to delete some sessions");
      }
    }
  };

  const handleExport = () => {
    exportToExcel(sessions, "Academic_Sessions");
    toast.success("Exporting table to Excel...");
  };

  if (isCreatingRoute || (isEditingRoute && editingSession)) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-slate-800 mb-8">
          {(isEditingRoute && editingSession) ? "Edit Session" : "Create Session"}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-6">
          <div className="space-y-6">
            <FormFieldHorizontal
              label="Session Name"
              value={formData.name}
              onChange={(val) => handleFormChange("name", val)}
            />
            <FormFieldHorizontal
              label="Type"
              type="select"
              options={Array.isArray(programTypes) ? programTypes.map((t) => ({
                label: t.name,
                value: t.id,
              })) : []}
              value={formData.type}
              onChange={(val) => handleFormChange("type", val)}
            />
            <FormFieldHorizontal
              label="Semesters"
              type="select"
              options={["1", "2", "3"]}
              value={formData.semesters}
              onChange={(val) => handleFormChange("semesters", val)}
            />
          </div>

          <div className="space-y-6">
            <FormFieldHorizontal
              label="Duration"
              type="select"
              options={["6 Months", "12 Months", "18 Months"]}
              value={formData.duration}
              onChange={(val) => handleFormChange("duration", val)}
            />
            <FormFieldHorizontal
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(val) => handleFormChange("startDate", val)}
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
            onClick={() => {
              navigate("/program-courses");
            }}
            disabled={isSaving}
            className="px-8 py-2.5 rounded-lg text-sm font-medium border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-2.5 rounded-lg text-sm font-bold bg-[#00B01D] text-white hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              (isEditingRoute && editingSession) ? "Update Session" : "Create Session"
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-end gap-6">
        <button
          onClick={handleExport}
          className="bg-white text-blue-600 px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-100 transition-all active:scale-95"
        >
          <Download size={18} /> Export table
        </button>
        <button
          onClick={() => navigate("/program-courses/sessions/new")}
          className="bg-[#00B01D] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-green-500/20 hover:bg-green-700 transition-all active:scale-95"
        >
          Create Session
        </button>
      </div>

      {/* Created Sessions Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-800">Created Sessions</h3>
          <div className="flex gap-3">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search by name, semester, or code"
                className="bg-white border border-slate-200 text-xs py-2.5 pl-4 pr-10 rounded-xl outline-none w-64 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter size={16} className="text-slate-400" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/60 border-y border-gray-100 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                <th className="px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer"
                    checked={sessions.length > 0 && selectedIds.length === sessions.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">Session Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Start Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                      <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm font-medium">Loading sessions...</span>
                    </div>
                  </td>
                </tr>
              ) : !Array.isArray(sessions) || sessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No sessions found
                  </td>
                </tr>
              ) : sessions.map((session) => (
                <tr key={session.id} className="hover:bg-slate-50/50 transition-colors text-slate-600">
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer"
                      checked={selectedIds.includes(session.id)}
                      onChange={() => toggleSelection(session.id)}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{session.name}</td>
                  <td className="px-6 py-4">{session.type}</td>
                  <td className="px-6 py-4">{session.duration}</td>
                  <td className="px-6 py-4">{session.startDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-1 rounded-full text-[11px] font-bold ${getStatusBadge(session.isActive)}`}>
                      {session.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          if (activeActionId === session.id) {
                            setActiveActionId(null);
                            setDropdownPosition(null);
                          } else {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setDropdownPosition({
                              top: rect.top - 10, // Position above the button
                              right: window.innerWidth - rect.right,
                            });
                            setActiveActionId(session.id);
                          }
                        }}
                        className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {activeActionId === session.id && dropdownPosition && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => {
                              setActiveActionId(null);
                              setDropdownPosition(null);
                            }}
                          />
                          <div 
                            className="fixed w-32 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1 animate-in fade-in zoom-in-95 duration-200"
                            style={{
                              top: dropdownPosition.top,
                              right: dropdownPosition.right,
                              transform: 'translateY(-100%)',
                            }}
                          >
                            <button
                              onClick={() => {
                                console.log("Edit", session.id);
                                navigate(`/program-courses/sessions/edit/${session.id}`);
                                setActiveActionId(null);
                                setDropdownPosition(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left"
                            >
                              <Edit size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(session.id);
                                setActiveActionId(null);
                                setDropdownPosition(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                            <div className="border-t border-gray-100 my-1 pt-1">
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    await academicsApi.updateSession(session.id, { ...session, isActive: !session.isActive });
                                    toast.success(`Session ${!session.isActive ? "activated" : "deactivated"}`);
                                    const updatedSessions = await academicsApi.getAcademicSessions();
                                    setSessions(updatedSessions);
                                  } catch (err) {
                                    toast.error("Failed to update status");
                                  }
                                  setActiveActionId(null);
                                  setDropdownPosition(null);
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                              >
                                <span className="flex items-center gap-2">
                                  <div className={`w-8 h-4 rounded-full relative transition-colors ${session.isActive ? 'bg-green-500' : 'bg-slate-300'}`}>
                                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${session.isActive ? 'right-0.5' : 'left-0.5'}`} />
                                  </div>
                                  Active
                                </span>
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Floating Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-xl shadow-2xl border border-gray-100 flex items-center gap-6 z-50 animate-in slide-in-from-bottom duration-300">
          <span className="text-sm font-bold text-slate-700">
            {selectedIds.length} items selected
          </span>
          <div className="h-6 w-px bg-slate-200"></div>
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
          >
            <Trash size={16} />
            Delete
          </button>
          <div className="h-6 w-px bg-slate-200"></div>
          <button
            onClick={() => setSelectedIds([])}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
            title="Unselect all"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default StructureTab;
