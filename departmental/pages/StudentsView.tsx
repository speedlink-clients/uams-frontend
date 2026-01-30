// StudentsView.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Loader2, X, FileDown, FileUp } from "lucide-react";
import { Student, StudentRole } from "../types";
import api from "../api/axios";
import { SearchFilterBar } from "../components/SearchFilterBAr";
import { StudentsTable } from "../components/StudentsTable";
import { Pagination } from "../components/Pagination";
import { StudentDetailsSidebar } from "../components/StudentDetailsSidedbar";
import { AddStudentForm } from "../components/AddStudentForm";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { studentsApi } from "../api/studentsapi";
import { programsCoursesApi } from "../api/programscourseapi";
import { academicsApi } from "../api/accademicapi"; // Note: filename typo in repo 'accademicapi'
import { toast } from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

interface ApiUser {
  id: string; // This is the ID used for sidebar profile fetch
  userId: string;
  studentId: string;
  level: string;
  levelId: string;
  isActive: boolean;
  user: {
    fullName: string;
    email: string;
    phone: string | null;
  };
  programId: string;
  createdAt: string;
  classRepRole?: "CLASS_REP" | "ASSISTANT_CLASS_REP"; // Assuming this might come from backend later, or we map it differently
}

interface UsersResponse {
  message: string;
  count: number;
  users: ApiUser[];
}

export const StudentsView: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedProgramType, setSelectedProgramType] = useState("all");
  const [selectedSession, setSelectedSession] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  const [programTypeOptions, setProgramTypeOptions] = useState<string[]>([]);
  const [sessionOptions, setSessionOptions] = useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch students, program types, and sessions
  useEffect(() => {
    fetchStudents();
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const [programsRes, sessionsRes] = await Promise.all([
        programsCoursesApi.getProgramTypes(),
        academicsApi.getSessions(),
      ]);

      setProgramTypeOptions(["all", ...programsRes.map((p) => p.name)]);
      setSessionOptions(["all", ...sessionsRes.map((s) => s.name)]);
    } catch (err) {
      console.error("Failed to load filter options", err);
      // Fallback or silent fail
    }
  };

  // const fetchStudents = async () => {
  //   try {
  //     setIsLoading(true);
  //     setError(null);

  //     const apiUsers = await studentsApi.getDepartmentStudents();
  //     console.log(apiUsers);

  //     // Filter only STUDENT roles and map to Student interface
  //     const studentData: Student[] = (apiUsers as any[]).map(
  //       (student, index) => ({
  //         // Log each student's department for debugging
  //       console.log(`Student ${index} Department:`, student.Department);
  //       console.log(`Student ${index} Department name:`, student.Department?.name);

  //         id: student.id || "N/A", // ID for sidebar fetch as requested
  //         regNo:
  //           student.registrationNo ||
  //           `2024${Math.floor(Math.random() * 1000000)}BA` ||
  //           "N/A", // Placeholder
  //         matNo: student.studentId || "N/A",
  //         surname: student.user.fullName.split(" ")[0] || "N/A",
  //         otherNames:
  //           student.user.fullName.split(" ").slice(1).join(" ") || "N/A",
  //         name: student.user.fullName || "N/A",
  //         email: student.user.email || "N/A",
  //         phoneNo: student.user.phone || "N/A",
  //         department: student.Department?.name || "N/A",
  //         level: getLevelFromLevelId(student.levelId) || "N/A",
  //         programId: student.programId || "",
  //         role: getProgramType(student.programId) || ("N/A" as StudentRole),
  //         sex: student.gender || "N/A", // Placeholder
  //         admissionMode: student.admissionMode || "N/A", // Placeholder
  //         entryQualification: student.entryQualification || "N/A", // Placeholder
  //         faculty: student.Department?.Faculty?.name || "N/A",
  //         // faculty: student.Department?.Faculty?.name || "N/A", // Placeholder
  //         degreeCourse: student.degreeCourse || "N/A", // Placeholder
  //         programDuration: student.courseDuration || "N/A", // Placeholder
  //         degreeAwardCode: student.degreeAwarded || "N/A", // Placeholder
  //         createdAt:
  //           new Date(student.createdAt).toLocaleDateString("en-US", {
  //             year: "numeric",
  //             month: "short",
  //             day: "numeric",
  //           }) || "N/A", // Storing visually formatted date, but filter logic handles it (or we should store raw too? using formatted for display)
  //         // Actually formatted "Oct 12, 2024" works for display, filter might need parsing or just simple string match if year is in it.
  //         // Let's assume consistent format.
  //         isActive: student.isActive || "N/A",
  //         // Note: Backend response doesn't explicitly show classRepRole in the example yet,
  //         // keeping optional access safely if it exists or default to undefined
  //         // Try to map session if available, otherwise fallback to date
  //         session:
  //           (student as any).session?.name ||
  //           new Date(student.createdAt).getFullYear().toString() + " Session" ||
  //           "N/A",
  //         classRepRole: (student as any).classRepRole || "N/A",
  //       }),
  //     );

  //     setStudents(studentData);
  //   } catch (err: any) {
  //     console.error("Error fetching students:", err);
  //     setError(err.response?.data?.message || "Failed to load students");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiUsers = await studentsApi.getDepartmentStudents();
      console.log("API Response:", apiUsers);
      console.log("Type of apiUsers:", typeof apiUsers);
      console.log("Is Array?", Array.isArray(apiUsers));

      if (Array.isArray(apiUsers) && apiUsers.length > 0) {
        console.log("First student Department:", apiUsers[0].Department);
        console.log(
          "First student Department name:",
          apiUsers[0].Department?.name,
        );
        console.log(
          "First student Department?.Faculty:",
          apiUsers[0].Department?.Faculty,
        );
        console.log(
          "First student Department?.Faculty?.name:",
          apiUsers[0].Department?.Faculty?.name,
        );
      }

      // Filter only STUDENT roles and map to Student interface
      const studentData: Student[] = (apiUsers as any[]).map(
        (student, index) => {
          // Log each student's department for debugging
          console.log(`Student ${index} Department:`, student.Department);
          console.log(
            `Student ${index} Department name:`,
            student.Department?.name,
          );

          return {
            id: student.id || "N/A",
            regNo:
              student.registrationNo ||
              `2024${Math.floor(Math.random() * 1000000)}BA` ||
              "N/A",
            matNo: student.studentId || "N/A",
            surname: student.user.fullName.split(" ")[0] || "N/A",
            otherNames:
              student.user.fullName.split(" ").slice(1).join(" ") || "N/A",
            name: student.user.fullName || "N/A",
            email: student.user.email || "N/A",
            phoneNo: student.user.phone || "N/A",
            department: student.Department?.name || "N/A",
            level: getLevelFromLevelId(student.levelId) || "N/A",
            programId: student.programId || "",
            role: getProgramType(student.programId) || ("N/A" as StudentRole),
            sex: student.gender || "N/A",
            admissionMode: student.admissionMode || "N/A",
            entryQualification: student.entryQualification || "N/A",
            faculty: student.Department?.Faculty?.name || "N/A",
            degreeCourse: student.degreeCourse || "N/A",
            programDuration: student.courseDuration || "N/A",
            degreeAwardCode: student.degreeAwarded || "N/A",
            createdAt:
              new Date(student.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }) || "N/A",
            isActive: student.isActive || "N/A",
            session:
              (student as any).session?.name ||
              new Date(student.createdAt).getFullYear().toString() +
                " Session" ||
              "N/A",
            classRepRole: (student as any).classRepRole || "N/A",
          };
        },
      );

      console.log("Mapped studentData:", studentData);
      setStudents(studentData);
    } catch (err: any) {
      console.error("Error fetching students:", err);
      setError(err.response?.data?.message || "Failed to load students");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter students based on search term and department
  const filteredStudents = useMemo(() => {
    let filtered = students;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(term) ||
          student.surname.toLowerCase().includes(term) ||
          student.otherNames.toLowerCase().includes(term) ||
          student.email.toLowerCase().includes(term) ||
          student.regNo.toLowerCase().includes(term) ||
          student.matNo.toLowerCase().includes(term) ||
          student.phoneNo.toLowerCase().includes(term),
      );
    }

    // Filter by level
    if (selectedLevel !== "all") {
      filtered = filtered.filter((student) => student.level === selectedLevel);
    }

    // Filter by Program Type
    if (selectedProgramType !== "all") {
      filtered = filtered.filter(
        (student) => student.role === selectedProgramType,
      );
    }

    // Filter by Session
    if (selectedSession !== "all") {
      filtered = filtered.filter((student) => {
        // Check mapped session property first
        if ((student as any).session === selectedSession) return true;

        // Fallback to year parsing (legacy support)
        const year = student.createdAt.split(",")[1]?.trim();
        const sessionName = `${year} Session`;

        // If selectedSession matches the "Name" from API directly, comparison is direct
        // If API returns "2024/2025", we match that.
        // If API returns just year, we match that.
        return (
          (student as any).session === selectedSession ||
          sessionName === selectedSession
        );
      });
    }

    return filtered;
  }, [
    students,
    searchTerm,
    selectedLevel,
    selectedProgramType,
    selectedSession,
  ]);

  // Paginate filtered students
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredStudents.slice(startIndex, endIndex);
  }, [filteredStudents, currentPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  }, [filteredStudents.length]);

  // Get unique levels for filter
  const levels = useMemo(() => {
    const uniqueLevels = Array.from(
      new Set(students.map((s) => s.level)),
    ).filter(Boolean); // Filter out any undefined/null values
    return ["all", ...uniqueLevels].sort();
  }, [students]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1); // Reset page on filter change
  }, [
    students,
    searchTerm,
    selectedLevel,
    selectedProgramType,
    selectedSession,
  ]);

  // Helper functions
  const getDepartmentFromProgramId = (programId?: string): string => {
    const programMap: Record<string, string> = {
      "506fe514-728c-432f-83c1-55546fdddb8f": "Computer Science",
      // Add more program ID mappings as needed
    };
    return programId
      ? programMap[programId] || "Unknown Department"
      : "Unknown Department";
  };

  const getLevelFromLevelId = (levelId?: string): string => {
    const levelMap: Record<string, string> = {
      "6106e865-cd28-45bd-b13c-afcb8dca7b45": "100",
      "a686c3ad-a974-4929-afde-e663aa862175": "200",
      // Add more level ID mappings as needed
    };
    return levelId ? levelMap[levelId] || "Unknown Level" : "Unknown Level";
  };

  const getProgramType = (programId?: string): StudentRole => {
    const programTypeMap: Record<string, StudentRole> = {
      "506fe514-728c-432f-83c1-55546fdddb8f": "Bachelors",
      // Add more mappings
    };
    return programId ? programTypeMap[programId] || "None" : "None";
  };

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedLevel("all");
    setSelectedProgramType("all");
    setSelectedSession("all");
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be selected again if needed
    event.target.value = "";

    try {
      setIsUploading(true);
      const loadingToast = toast.loading("Uploading students...");

      await studentsApi.bulkUploadStudents(file);

      toast.dismiss(loadingToast);
      toast.success("Students uploaded successfully");

      // Refresh list
      fetchStudents();
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to upload students");
    } finally {
      setIsUploading(false);
    }
  };

  const handleBulkDownload = async (ids: string[]) => {
    try {
      const loadingToast = toast.loading("Downloading students data...");
      const blob = await studentsApi.bulkDownloadStudents(ids);

      // Create download link
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "students_data.csv");
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.dismiss(loadingToast);
      toast.success("Download started successfully");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download file");
    }
  };

  const handleBulkDelete = (ids: string[]) => {
    setIdsToDelete(ids);
    setIsDeleteModalOpen(true);
  };

  const confirmBulkDelete = async (reason: string) => {
    try {
      await studentsApi.bulkDeleteStudents(idsToDelete, reason);
      toast.success("Students deleted successfully");
      setIsDeleteModalOpen(false);
      setIdsToDelete([]);
      fetchStudents(); // Refresh list
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.message || "Failed to delete students");
      // Keep modal open on error or close it? usually keep open to show error, but here using toast
    }
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/departmental-admin/documents/Students_Sample_File.csv";
    link.setAttribute("download", "Students_Sample_File.csv");
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500">Loading students...</p>
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
          Failed to Load Students
        </h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchStudents}
          className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  const filters = [
    {
      key: "level",
      value: selectedLevel,
      onChange: setSelectedLevel,
      options: levels,
      defaultLabel: "All Levels",
    },
    {
      key: "programType",
      value: selectedProgramType,
      onChange: setSelectedProgramType,
      options: programTypeOptions.length > 0 ? programTypeOptions : ["all"],
      defaultLabel: "All Programs",
    },
    {
      key: "session",
      value: selectedSession,
      onChange: setSelectedSession,
      options: sessionOptions.length > 0 ? sessionOptions : ["all"],
      defaultLabel: "All Sessions",
    },
  ];

  return (
    <div className="relative animate-in fade-in duration-500">
      <div
        className={`space-y-6 transition-all duration-300 ${
          selectedStudent ? "pr-[400px]" : ""
        }`}
      >
        <div className="flex justify-between items-start mb-10">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-slate-900">Students</h2>
            <p className="text-slate-500 mt-2">
              {students.length} total students • {filteredStudents.length}{" "}
              filtered
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#1D7AD9] text-[#1D7AD9] rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors"
            >
              <FileDown size={18} />
              Download Sample File
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".csv"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#1D7AD9] text-[#1D7AD9] rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <FileUp size={18} />
              )}
              {isUploading ? "Uploading..." : "Upload CSV"}
            </button>
            <button
              onClick={() => setIsAddStudentModalOpen(true)}
              className="bg-[#1D7AD9] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
            >
              <Plus size={18} /> Add Students
            </button>
          </div>
        </div>

        <SearchFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          onClearFilters={clearFilters}
        />

        <StudentsTable
          students={students}
          filteredStudents={paginatedStudents}
          allMatchingStudents={filteredStudents} // Pass full filtered list for select-all
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
          searchTerm={searchTerm}
          onEdit={(student) => {
            setStudentToEdit(student);
            setIsAddStudentModalOpen(true);
          }}
          onBulkDownload={handleBulkDownload}
          onBulkDelete={handleBulkDelete}
        />

        {filteredStudents.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={students.length}
            filteredItemsCount={filteredStudents.length}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {selectedStudent && (
        <StudentDetailsSidebar
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {(isAddStudentModalOpen || studentToEdit) && (
        <AddStudentForm
          initialData={studentToEdit}
          onClose={() => {
            setIsAddStudentModalOpen(false);
            setStudentToEdit(null);
          }}
          onSubmit={async (data) => {
            try {
              if (studentToEdit) {
                // Edit mode
                await api.patch(`/students/${studentToEdit.id}`, data);
                // Refresh list
                fetchStudents();
              } else {
                // Add mode (keeping mock for now unless specified)
                console.log("Adding student:", data);
                await new Promise((resolve) => setTimeout(resolve, 1000));
              }

              setIsAddStudentModalOpen(false);
              setStudentToEdit(null);
            } catch (err) {
              console.error("Failed to save student:", err);
              // You might want to show a toast here, e.g. toast.error("Failed to save")
            }
          }}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmBulkDelete}
        title="Delete Students"
        description="This action cannot be undone. This will permanently delete the selected student records from the system."
        itemCount={idsToDelete.length}
      />
    </div>
  );
};
