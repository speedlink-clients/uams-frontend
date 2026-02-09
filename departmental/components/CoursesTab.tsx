import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { Plus, Search, Filter, Loader2, X, MoreHorizontal, Pencil, Trash, Download, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import CourseForm from "./CourseForm";
import { programsCoursesApi } from "../api/programscourseapi";
import { exportToExcel } from "../utils/excelExport";
import { academicsApi, Level, Semester } from "../api/accademicapi";

// Helper to format semester names: "Semester 1" -> "First Semester", "Semester 2" -> "Second Semester"
const formatSemesterName = (name: string | undefined): string => {
  if (!name) return "N/A";
  if (name === "Semester 1" || name.toLowerCase().includes("semester 1")) return "First Semester";
  if (name === "Semester 2" || name.toLowerCase().includes("semester 2")) return "Second Semester";
  return name;
};

// Credit Limit Section Component
const CreditLimitSection: React.FC = () => {
  const [creditLimits, setCreditLimits] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    programId: "",
    levelId: "",
    semesterId: "",
    maxCreditLoad: 24,
  });

  useEffect(() => {
    fetchCreditLimits();
    fetchInitialData();
  }, []);

  // Fetch levels when programId changes
  useEffect(() => {
    if (formData.programId) {
      academicsApi.getLevels(formData.programId).then(setLevels).catch(() => setLevels([]));
    } else {
      setLevels([]);
    }
  }, [formData.programId]);

  const fetchCreditLimits = async () => {
    try {
      setIsLoading(true);
      const data = await programsCoursesApi.getCreditLimits();
      setCreditLimits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch credit limits:", err);
      setCreditLimits([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInitialData = async () => {
    try {
      const [programsData, semestersData] = await Promise.all([
        programsCoursesApi.getProgramsByDepartment(),
        academicsApi.getSemesters(),
      ]);
      setPrograms(programsData);
      setSemesters(semestersData);
    } catch (err) {
      console.error("Failed to fetch initial data:", err);
    }
  };

  const formatSemesterName = (name: string) => {
    if (!name) return name;
    if (name === "Semester 1" || name.toLowerCase() === "semester 1") return "First Semester";
    if (name === "Semester 2" || name.toLowerCase() === "semester 2") return "Second Semester";
    return name;
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === creditLimits.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(creditLimits.map((cl) => cl.id));
    }
  };

  const handleSave = async () => {
    if (!formData.levelId || !formData.semesterId) {
      toast.error("Please select level and semester");
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        levelId: formData.levelId,
        semesterId: formData.semesterId,
        maxCreditLoad: Number(formData.maxCreditLoad),
      };

      if (editingId) {
        await programsCoursesApi.updateCreditLimit(editingId, payload);
        toast.success("Credit limit updated successfully");
      } else {
        await programsCoursesApi.createCreditLimit(payload);
        toast.success("Credit limit created successfully");
      }

      setIsFormOpen(false);
      setEditingId(null);
      setFormData({ programId: "", levelId: "", semesterId: "", maxCreditLoad: 24 });
      fetchCreditLimits();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save credit limit");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this credit limit?")) {
      try {
        await programsCoursesApi.deleteCreditLimit(id);
        toast.success("Credit limit deleted");
        fetchCreditLimits();
      } catch (err) {
        toast.error("Failed to delete credit limit");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Delete ${selectedIds.length} selected credit limits?`)) {
      try {
        await Promise.all(selectedIds.map((id) => programsCoursesApi.deleteCreditLimit(id)));
        toast.success(`${selectedIds.length} credit limits deleted`);
        setSelectedIds([]);
        fetchCreditLimits();
      } catch (err) {
        toast.error("Failed to delete some credit limits");
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-8">
      <div className="p-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">
          Credit Limit ({creditLimits.length})
        </h3>
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-red-600 transition-all"
            >
              <Trash size={16} /> Delete ({selectedIds.length})
            </button>
          )}
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-blue-700 transition-all"
          >
            <Plus size={16} /> Create Credit Limit
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="px-6 pb-6">
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h4 className="text-md font-semibold text-slate-700 mb-4">{editingId ? "Edit Credit Limit" : "New Credit Limit"}</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                <select
                  value={formData.programId}
                  onChange={(e) => setFormData({ ...formData, programId: e.target.value, levelId: "" })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Program</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <select
                  value={formData.levelId}
                  onChange={(e) => setFormData({ ...formData, levelId: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!formData.programId}
                >
                  <option value="">Select Level</option>
                  {levels.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <select
                  value={formData.semesterId}
                  onChange={(e) => setFormData({ ...formData, semesterId: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Semester</option>
                  {semesters.map((s) => (
                    <option key={s.id} value={s.id}>{formatSemesterName(s.name)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credit Load</label>
                <input
                  type="number"
                  value={formData.maxCreditLoad}
                  onChange={(e) => setFormData({ ...formData, maxCreditLoad: Number(e.target.value) })}
                  className="w-full rounded-md bg-white border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={1}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => { setIsFormOpen(false); setEditingId(null); setFormData({ programId: "", levelId: "", semesterId: "", maxCreditLoad: 24 }); }}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 flex items-center gap-2"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSaving ? "Saving..." : (editingId ? "Update" : "Create")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/60 border-y border-gray-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <th className="px-6 py-4 w-12 text-center">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer"
                  checked={creditLimits.length > 0 && selectedIds.length === creditLimits.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-6 py-4">Level</th>
              <th className="px-6 py-4">Semester</th>
              <th className="px-6 py-4">Credit Load</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  <Loader2 className="animate-spin h-6 w-6 mx-auto" />
                </td>
              </tr>
            ) : creditLimits.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No credit limits found
                </td>
              </tr>
            ) : (
              creditLimits.map((cl) => (
                <tr key={cl.id} className={`hover:bg-slate-50/50 transition-colors text-sm text-slate-600 ${selectedIds.includes(cl.id) ? "bg-blue-50/30" : ""}`}>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer"
                      checked={selectedIds.includes(cl.id)}
                      onChange={() => toggleSelection(cl.id)}
                    />
                  </td>
                  <td className="px-6 py-4">{cl.level?.name || cl.levelId}</td>
                  <td className="px-6 py-4">{formatSemesterName(cl.semesterDetail?.name)}</td>
                  <td className="px-6 py-4">{cl.maxCreditLoad}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setFormData({
                            programId: cl.programId || "",
                            levelId: cl.levelId || "",
                            semesterId: cl.semesterId || "",
                            maxCreditLoad: cl.maxCreditLoad || 24,
                          });
                          setEditingId(cl.id);
                          setIsFormOpen(true);
                        }}
                        className="p-1 hover:bg-amber-50 text-amber-500 rounded transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cl.id)}
                        className="p-1 hover:bg-red-50 text-red-500 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface CoursesTabProps {
  isCreatingRoute?: boolean;
  isEditingRoute?: boolean;
}

const CoursesTab: React.FC<CoursesTabProps> = ({ isCreatingRoute, isEditingRoute }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync editingCourse with route ID
  useEffect(() => {
    if (isEditingRoute && id && courses.length > 0) {
      const course = courses.find(c => c.id === id);
      if (course) setEditingCourse(course);
    } else if (!isEditingRoute) {
      setEditingCourse(null);
    }
  }, [isEditingRoute, id, courses]);

  // Toggle selection for a single course
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCourses.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCourses.map((c) => c.id));
    }
  };

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdownId(activeDropdownId === id ? null : id);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter courses when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCourses(courses);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = courses.filter(
        (course) =>
          course.title?.toLowerCase().includes(term) ||
          course.code?.toLowerCase().includes(term) ||
          course.level?.name?.toLowerCase().includes(term) ||
          course.semester?.name?.toLowerCase().includes(term)
      );
      setFilteredCourses(filtered);
    }
  }, [searchTerm, courses]);

  // Pagination Logic
  const totalItems = filteredCourses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search or data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, courses, itemsPerPage]);

  // Format semester names
  const formatSemesterName = (name: string) => {
    if (!name) return name;
    if (name === "Semester 1" || name.toLowerCase() === "semester 1") return "First Semester";
    if (name === "Semester 2" || name.toLowerCase() === "semester 2") return "Second Semester";
    if (name === "Semester 3" || name.toLowerCase() === "semester 3") return "Third Semester";
    return name;
  };

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // ✅ FIX: department is resolved from JWT (NO hardcoded ID)
      const response = await programsCoursesApi.getCoursesByDepartment();

      if (response.status === "success" && response.courses) {
        setCourses(response.courses);
        setFilteredCourses(response.courses);
      }
    } catch (err: any) {
      console.error("Error fetching courses:", err);
      setError(err.response?.data?.message || "Failed to load courses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdateCourse = async (courseData: any) => {
    try {
      if (editingCourse) {
        await programsCoursesApi.updateCourse(editingCourse.id, courseData);
        toast.success("Course updated successfully");
      } else {
        await programsCoursesApi.createCourse(courseData);
        toast.success("Course created successfully");
      }

      setEditingCourse(null);
      fetchCourses();
      navigate("/program-courses/courses"); // Navigate back to list after create/update
    } catch (err: any) {
      console.error("Error saving course:", err);
      toast.error(err.response?.data?.message || "Failed to save course");
      throw err;
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (window.confirm(`Are you sure you want to delete the course "${code}"?`)) {
      try {
        await programsCoursesApi.deleteCourse(id);
        toast.success("Course deleted successfully");
        await fetchCourses();
      } catch (err: any) {
        console.error("Error deleting course:", err);
        toast.error("Failed to delete course");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected courses?`)) {
      try {
        await Promise.all(selectedIds.map(id => programsCoursesApi.deleteCourse(id)));
        toast.success(`${selectedIds.length} courses deleted successfully`);
        setSelectedIds([]);
        await fetchCourses();
      } catch (err: any) {
        console.error("Error bulk deleting courses:", err);
        toast.error("Failed to delete some courses");
      }
    }
  };

  const handleExport = () => {
    const dataToExport = filteredCourses.map(c => ({
      "Code": c.code,
      "Course Title": c.title,
      "Level": c.level?.name || "N/A",
      "Semester": c.semester?.name || "N/A",
      "Credit Units": c.creditUnits,
      "Status": c.semester?.isActive ? "Active" : "Inactive"
    }));

    exportToExcel(dataToExport, "courses_list", "Courses");
    toast.success("Exporting table to Excel...");
  };

  if (isCreatingRoute || (isEditingRoute && editingCourse)) {
    return (
      <CourseForm
        initialData={editingCourse}
        onSubmit={handleCreateOrUpdateCourse}
        onCancel={() => {
          navigate("/program-courses/courses");
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto mt-10">
        <div className="text-red-500 mb-4">
          <X className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-bold text-red-700 mb-2">
          Failed to Load Courses
        </h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchCourses}
          className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-6">
        <button
          onClick={handleExport}
          className="bg-white text-blue-600 px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-100 transition-all active:scale-95"
        >
          <Download size={18} /> Export table
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv, .xlsx"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            try {
              setIsUploading(true);
              const formData = new FormData();
              formData.append("file", file);

              await programsCoursesApi.bulkUploadCourses(formData);
              toast.success("Courses uploaded successfully!");
              fetchCourses();
            } catch (error: any) {
              console.error("Bulk upload failed:", error);
              toast.error(error.response?.data?.message || "Failed to upload courses");
            } finally {
              setIsUploading(false);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }
          }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-white text-green-600 px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-green-500/20 hover:bg-green-50 transition-all active:scale-95 disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <Upload size={18} /> Upload CSV
            </>
          )}
        </button>
        <button
          onClick={() => navigate("/program-courses/courses/new")}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
        >
          <Plus size={18} /> Create Course
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <div className="p-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">
            Created Courses ({filteredCourses.length})
          </h3>

          <div className="flex gap-3">
            <div className="relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Search by title, code, or level"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-slate-200 text-xs py-2 pl-9 pr-3 rounded-xl outline-none w-64 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter size={16} className="text-slate-400" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-w-[calc(100vw_-_300px)]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/60 border-y border-gray-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer"
                    checked={
                      filteredCourses.length > 0 &&
                      selectedIds.length === filteredCourses.length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Course Title</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Semester</th>
                <th className="px-6 py-4">Credit Units</th>
                <th className="px-6 py-4">Learning Hours</th>
                <th className="px-6 py-4">Practical Hours</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {paginatedCourses.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    {searchTerm
                      ? "No courses match your search"
                      : "No courses found"}
                  </td>
                </tr>
              ) : (
                paginatedCourses.map((course) => (
                  <tr
                    key={course.id}
                    className={`hover:bg-slate-50/50 transition-colors text-sm text-slate-600 group ${selectedIds.includes(course.id) ? "bg-blue-50/30" : ""
                      }`}
                  >
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer"
                        checked={selectedIds.includes(course.id)}
                        onChange={() => toggleSelection(course.id)}
                      />
                    </td>
                    <td className="px-6 py-4 font-medium">{course.code}</td>
                    <td className="px-6 py-4">{course.title}</td>
                    <td className="px-6 py-4">{course.level?.name}</td>
                    <td className="px-6 py-4">{formatSemesterName(course.semester?.name)}</td>
                    <td className="px-6 py-4">{course.creditUnits}</td>
                    <td className="px-6 py-4">{course.learningHours}</td>
                    <td className="px-6 py-4">{course.practicalHours}</td>
                    <td className="px-6 py-4">{course.status}</td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={(e) => toggleDropdown(course.id, e)}
                          className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-300 hover:text-slate-600"
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {activeDropdownId === course.id && (
                          <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/program-courses/courses/edit/${course.id}`);
                                  setActiveDropdownId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              >
                                <Pencil size={14} />
                                Edit details
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(course.id, course.code);
                                  setActiveDropdownId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash size={14} />
                                Delete
                              </button>
                              {/* <div className="border-t border-gray-100 my-1 pt-1">
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                      await programsCoursesApi.updateCourseStatus(course.id, { isActive: !course.semester?.isActive });
                                      toast.success(`Course ${!course.semester?.isActive ? "activated" : "deactivated"}`);
                                      fetchCourses();
                                    } catch (err) {
                                      toast.error("Failed to update status");
                                    }
                                    setActiveDropdownId(null);
                                  }}
                                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                  <span className="flex items-center gap-2">
                                    <div className={`w-8 h-4 rounded-full relative transition-colors ${course.semester?.isActive ? 'bg-green-500' : 'bg-slate-300'}`}>
                                      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${course.semester?.isActive ? 'right-0.5' : 'left-0.5'}`} />
                                    </div>
                                    Active
                                  </span>
                                </button>
                              </div> */}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-slate-50/10">
          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="text-slate-700">{totalItems > 0 ? startIndex + 1 : 0}</span> to{" "}
            <span className="text-slate-700">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of{" "}
            <span className="text-slate-700">{totalItems}</span> results
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="text-xs bg-transparent font-bold text-slate-600 outline-none cursor-pointer hover:text-blue-600 transition-colors"
              >
                {[10, 20, 50, 100].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                  })
                  .map((page, index, array) => {
                    const prevPage = array[index - 1];
                    const showEllipsis = prevPage && page - prevPage > 1;

                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <span className="text-slate-400 px-1 text-xs">...</span>}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-[32px] h-8 text-xs font-bold rounded-lg transition-all ${currentPage === page
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                            : "text-slate-500 hover:bg-slate-50"
                            }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CREDIT LIMIT SECTION */}
      <CreditLimitSection />

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

export default CoursesTab;
// import { Plus, Search, Filter, Loader2, X, MoreHorizontal } from "lucide-react";
// // import CourseForm from "./CourseForm";
// import { programsCoursesApi } from "../api/programscourseapi";
// // import { CURRENT_DEPARTMENT_ID } from "../utils/constants";

// const CoursesTab: React.FC = () => {
//   const [isCreating, setIsCreating] = useState(false);
//   const [courses, setCourses] = useState<any[]>([]);
//   const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Fetch courses on component mount
//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   // Filter courses when search term changes
//   useEffect(() => {
//     if (searchTerm.trim() === "") {
//       setFilteredCourses(courses);
//     } else {
//       const term = searchTerm.toLowerCase();
//       const filtered = courses.filter(
//         (course) =>
//           course.title?.toLowerCase().includes(term) ||
//           course.code?.toLowerCase().includes(term) ||
//           course.level?.name?.toLowerCase().includes(term) ||
//           course.semester?.name?.toLowerCase().includes(term)
//       );
//       setFilteredCourses(filtered);
//     }
//   }, [searchTerm, courses]);

//   const fetchCourses = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await programsCoursesApi.getCoursesByDepartment(
//         CURRENT_DEPARTMENT_ID
//       );
//       if (response.status === "success" && response.courses) {
//         setCourses(response.courses);
//         setFilteredCourses(response.courses);
//       }
//     } catch (err: any) {
//       console.error("Error fetching courses:", err);
//       setError(err.response?.data?.message || "Failed to load courses");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCreateCourse = async (courseData: any) => {
//     try {
//       await programsCoursesApi.createCourse(courseData);
//       setIsCreating(false);
//       fetchCourses(); // Refresh the list
//     } catch (err: any) {
//       console.error("Error creating course:", err);
//       throw err;
//     }
//   };

//   if (isCreating) {
//     return (
//       <CourseForm
//         onSubmit={handleCreateCourse}
//         onCancel={() => setIsCreating(false)}
//       />
//     );
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
//           <p className="text-slate-500">Loading courses...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto mt-10">
//         <div className="text-red-500 mb-4">
//           <X className="h-12 w-12 mx-auto" />
//         </div>
//         <h3 className="text-lg font-bold text-red-700 mb-2">
//           Failed to Load Courses
//         </h3>
//         <p className="text-red-600 mb-4">{error}</p>
//         <button
//           onClick={fetchCourses}
//           className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-end">
//         <button
//           onClick={() => setIsCreating(true)}
//           className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
//         >
//           <Plus size={18} /> Create Course
//         </button>
//       </div>

//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//         <div className="p-6 flex items-center justify-between">
//           <h3 className="text-lg font-bold text-slate-800">
//             Created Courses ({filteredCourses.length})
//           </h3>
//           <div className="flex gap-3">
//             <div className="relative group">
//               <Search
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                 size={14}
//               />
//               <input
//                 type="text"
//                 placeholder="Search by title, code, or level"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="bg-white border border-slate-200 text-xs py-2 pl-9 pr-3 rounded-xl outline-none w-64 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
//               />
//               {searchTerm && (
//                 <button
//                   onClick={() => setSearchTerm("")}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                 >
//                   <X size={14} />
//                 </button>
//               )}
//             </div>
//             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
//               <Filter size={16} className="text-slate-400" />
//               Filter
//             </button>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-slate-50/60 border-y border-gray-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
//                 <th className="px-6 py-4 w-12 text-center">
//                   <input
//                     type="checkbox"
//                     className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10"
//                   />
//                 </th>
//                 <th className="px-6 py-4">Code</th>
//                 <th className="px-6 py-4">Course Title</th>
//                 <th className="px-6 py-4">Level</th>
//                 <th className="px-6 py-4">Semester</th>
//                 <th className="px-6 py-4">Credit Units</th>
//                 <th className="px-6 py-4">Status</th>
//                 <th className="px-6 py-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {filteredCourses.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={8}
//                     className="px-6 py-8 text-center text-slate-500"
//                   >
//                     {searchTerm
//                       ? "No courses match your search"
//                       : "No courses found"}
//                   </td>
//                 </tr>
//               ) : (
//                 filteredCourses.map((course) => (
//                   <tr
//                     key={course.id}
//                     className="hover:bg-slate-50/50 transition-colors text-sm text-slate-600 group"
//                   >
//                     <td className="px-6 py-4 text-center">
//                       <input
//                         type="checkbox"
//                         className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10"
//                       />
//                     </td>
//                     <td className="px-6 py-4 font-medium text-slate-500">
//                       {course.code}
//                     </td>
//                     <td className="px-6 py-4 text-slate-500">{course.title}</td>
//                     <td className="px-6 py-4 text-slate-500">
//                       {course.level?.name || "N/A"}
//                     </td>
//                     <td className="px-6 py-4 text-slate-500">
//                       <span
//                         className={`px-2 py-1 rounded text-[10px] font-bold ${
//                           course.semester?.isActive
//                             ? "bg-blue-100 text-blue-600"
//                             : "bg-slate-100 text-slate-400"
//                         }`}
//                       >
//                         {course.semester?.name}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-slate-500">
//                       {course.creditUnits}
//                     </td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-sm ${
//                           course.semester?.isActive
//                             ? "bg-emerald-100 text-emerald-600"
//                             : "bg-rose-100 text-rose-400"
//                         }`}
//                       >
//                         {course.semester?.isActive ? "Active" : "Inactive"}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <button className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-300 hover:text-slate-600">
//                         <MoreHorizontal size={18} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CoursesTab;
