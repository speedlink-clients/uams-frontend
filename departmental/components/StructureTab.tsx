import React, { useState } from "react";
import { Filter, MoreHorizontal, Search, ChevronDown, Edit, Trash2 } from "lucide-react";
import FormFieldHorizontal from "./FormFieldHorizontal";
import { programsCoursesApi } from "../api/programscourseapi";
import { academicsApi } from "../api/accademicapi";
import { ProgramTypeResponse } from "../api/types";
import { toast } from "react-hot-toast";



const StructureTab: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [programTypes, setProgramTypes] = useState<ProgramTypeResponse[]>([]);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  const [isCreating, setIsCreating] = useState(false);

  // Fetch Program Types on Mount
  // Fetch Program Types and Sessions on Mount
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
  }, []);
  
  // Form State
  const [editingSession, setEditingSession] = useState<any | null>(null);
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

  const getStatusBadge = (status: string) => {
    return status === "Ongoing" 
      ? "bg-green-100 text-green-600" 
      : "bg-red-100 text-red-600";
  };
  
  const handleSave = async () => {
      // Validate inputs?
      
      try {
        const payload = {
            ...formData,
            semesterCount: Number(formData.semesters),
            isActive: true // Default to active?
        };
        
        // Remove helper fields not in payload if any (formData has semesterCount? no it has semesters string)
        // payload needs: name, type, semesterCount, duration, startDate, description, isActive
        
        if (editingSession) {
             await academicsApi.updateSession(editingSession.id, {
                name: payload.name, 
                type: programTypes.find(t => t.id === payload.type)?.name || payload.type, 
                semesterCount: Number(payload.semesters),
                duration: payload.duration,
                startDate: payload.startDate,
                description: payload.description,
                isActive: true
            });
        } else {
            await academicsApi.createSession({
                name: payload.name, 
                type: programTypes.find(t => t.id === payload.type)?.name || payload.type, 
                semesterCount: Number(payload.semesters),
                duration: payload.duration,
                startDate: payload.startDate,
                description: payload.description,
                isActive: true
            });
        }

        toast.success(editingSession ? "Session updated" : "Session created");
        setIsCreating(false);
        setEditingSession(null);
        
        // Refresh list
        const updatedSessions = await academicsApi.getAcademicSessions();
        setSessions(updatedSessions);
        
      } catch (error: any) {
          console.error("Failed to save session", error);
          toast.error(error.response?.data?.message || "Failed to save session");
      }
  };

  if (isCreating || editingSession) {
      return (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-8">
                {editingSession ? "Edit Session" : "Create Session"}
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
                    setIsCreating(false);
                    setEditingSession(null);
                }}
                className="px-8 py-2.5 rounded-lg text-sm font-medium border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={handleSave}
                className="px-8 py-2.5 rounded-lg text-sm font-bold bg-[#00B01D] text-white hover:bg-green-700 transition-colors shadow-sm"
            >
                {editingSession ? "Update Session" : "Create Session"}
            </button>
            </div>
        </div>
      );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-end">
            <button 
                onClick={() => setIsCreating(true)}
                className="bg-[#00B01D] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-green-500/20 hover:bg-green-700 transition-all active:scale-95"
            >
                Create Session
            </button>
        </div>

      {/* Created Sessions Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/60 border-y border-gray-100 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                <th className="px-6 py-4 w-12 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer" />
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
              {Array.isArray(sessions) && sessions.map((session) => (
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
                    <span className={`px-4 py-1 rounded-full text-[11px] font-bold ${getStatusBadge(session.status)}`}>
                      {session.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="relative">
                      <button 
                        onClick={() => setActiveActionId(activeActionId === session.id ? null : session.id)}
                        className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      
                      {activeActionId === session.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setActiveActionId(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-1 animate-in fade-in zoom-in-95 duration-200">
                            <button 
                              onClick={() => {
                                console.log("Edit", session.id);
                                setEditingSession(session); // Populate form
                                setActiveActionId(null);
                                window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to form
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left"
                            >
                              <Edit size={14} />
                              Edit
                            </button>
                            <button 
                              onClick={() => {
                                console.log("Delete", session.id);
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StructureTab;
