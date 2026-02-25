
import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, FileUp, Filter, MoreHorizontal, UserCog, Pencil, Trash, Download, FileDown, Upload, X, Loader2 } from 'lucide-react';
import { AssignCourseModal } from "./AssignCourseModal";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { staffApi } from "../api/staffapi";
import { toast } from "react-hot-toast";
import { StaffTable, StaffListItem } from "./StaffTable";
import { AddStaffForm } from "./AddStaffForm";

const STAFF_MOCK_DATA: StaffListItem[] = Array(12).fill(null).map((_, i) => ({
  id: `${i + 1}`,
  staffId: 'U2020/2502201',
  name: 'Justice Amadi',
  email: 'justiceamadi@gmail.com',
  phone: '+2348012345678',
  department: 'Computer Science',
  level: '100',
  program: 'Bachelors'
}));

export const StaffView: React.FC = () => {
  const [isAssignCourseModalOpen, setIsAssignCourseModalOpen] = useState(false);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  
  // Bulk Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Bulk Upload State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [staff, setStaff] = useState<any[]>([]); // Replace any with proper type
  const [staffToEdit, setStaffToEdit] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
      try {
          setIsLoading(true);
          const data = await staffApi.getDepartmentLecturers();
          if (data && data.success && Array.isArray(data.lecturers)) {
              const mappedStaff = data.lecturers.map((lecturer: any) => ({
                  id: lecturer.id,
                  staffId: lecturer.staffNumber || "N/A",
                  name: lecturer.user?.fullName || "N/A",
                  email: lecturer.user?.email || "N/A",
                  phone: lecturer.phone || lecturer.user?.phone || "N/A",
                  department: lecturer.department?.name || "N/A",
                  level: lecturer.academicRank || "N/A",
                  program: lecturer.specialization || "N/A" // Mapping specialization to program/field for now
              }));
              setStaff(mappedStaff);
          } else {
              setStaff([]);
          }
      } catch (error) {
          console.error("Failed to fetch staff", error);
          toast.error("Failed to load lecturers");
      } finally {
          setIsLoading(false);
      }
  };

  /* Updated to match backend payload requirement */
  const handleAssignCourse = async (data: { courseId: string; role: string }) => {
    if (!selectedStaffId) return;

    try {
      console.log("Assigning course:", data, "to staff:", selectedStaffId);
      
      const payload = {
        courseAssignments: [
          {
            courseId: data.courseId,
            role: data.role as "MAIN" | "ASSISTANT" | "LAB_ASSISTANT",
          },
        ],
      };

      await staffApi.assignCourses(selectedStaffId, payload);
      toast.success("Course assigned successfully");
      setIsAssignCourseModalOpen(false);
    } catch (error: any) {
      console.error("Failed to assign course:", error);
      toast.error(error.response?.data?.message || "Failed to assign course");
    }
  };


  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      // const departmentId = localStorage.getItem('departmentId') || '';
      // formData.append('departmentId', departmentId);

      await staffApi.bulkUploadLecturers(formData);

      toast.success('Lecturers uploaded successfully!');
      setShowUploadModal(false);
      setSelectedFile(null);
      fetchStaff();
    } catch (err: any) {
      console.error('Upload failed', err);
      toast.error(err?.response?.data?.message || 'Failed to upload lecturers');
    } finally {
      setUploading(false);
    }
  };

  const handleBulkDownload = async (ids: string[]) => {
    try {
      const toastId = toast.loading("Downloading staff data...");
      const blob = await staffApi.bulkDownloadStaff(ids);
      
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Staff_Data.csv'); // Or get filename from headers if needed
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      
      toast.success("Download started", { id: toastId });
    } catch (error: any) {
      console.error("Bulk download failed:", error);
      toast.error(error.response?.data?.message || "Failed to download staff data");
    }
  };

  const handleBulkDelete = (ids: string[]) => {
    setIdsToDelete(ids);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async (reason: string) => {
    if (idsToDelete.length === 0) return;

    try {
      setIsDeleting(true);
      await staffApi.bulkDeleteStaff(idsToDelete);
      toast.success("Selected staff members deleted successfully");
      setIsDeleteModalOpen(false);
      setIdsToDelete([]);
      // Here you would typically trigger a refresh of the staff list
    } catch (error: any) {
      console.error("Failed to delete staff:", error);
      toast.error(error.response?.data?.message || "Failed to delete staff");
    } finally {
        setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Lecturers</h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage department lecturers and their roles
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#1D7AD9] text-[#1D7AD9] rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors"
          >
            <FileUp size={18} />
            Upload CSV
          </button>
          <button 
            onClick={() => setIsAddStaffModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1D7AD9] text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} />
            Add Lecturer
          </button>
        </div>
      </div>

      <div className="flex justify-end items-center gap-3 mb-6">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search by name, email or code" 
            className="bg-white border border-slate-200 text-xs py-2.5 px-4 rounded-lg outline-none w-72 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 shadow-sm" 
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
          <Filter size={16} className="text-slate-800" />
          Filter
        </button>
      </div>

      <StaffTable 
         staff={staff} 
         allMatchingStaff={staff}
         onAssignCourse={(item) => {
             setSelectedStaffId(item.id);
             setIsAssignCourseModalOpen(true);
         }}
         onEdit={(item) => {
             setStaffToEdit(item);
             setIsAddStaffModalOpen(true);
         }}
         onBulkDownload={handleBulkDownload}
         onBulkDelete={handleBulkDelete}
         isLoading={isLoading}
      />

      <AssignCourseModal
        isOpen={isAssignCourseModalOpen}
        onClose={() => setIsAssignCourseModalOpen(false)}
        onAssign={handleAssignCourse}
        staffName={staff.find((s) => s.id === selectedStaffId)?.name}
      />

      {(isAddStaffModalOpen || staffToEdit) && (
        <AddStaffForm
          initialData={staffToEdit}
          onClose={() => {
            setIsAddStaffModalOpen(false);
            setStaffToEdit(null);
          }}
          onSubmit={async (data) => {
            try {
              if (staffToEdit) {
                 await staffApi.updateLecturer(staffToEdit.id, data);
                 toast.success("Lecturer updated successfully");
              } else {
                 await staffApi.addLecturer(data);
                 toast.success("Lecturer added successfully");
              }
              
              setIsAddStaffModalOpen(false);
              setStaffToEdit(null);
              fetchStaff(); // Refresh
            } catch (error: any) {
              console.error("Failed to save lecturer:", error);
              toast.error(error.response?.data?.message || "Failed to save lecturer");
            }
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Lecturers"
        description={`Are you sure you want to delete ${idsToDelete.length} selected lecturer(s)? This action cannot be undone.`}
        itemCount={idsToDelete.length}
      />

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Upload Lecturers</h3>
              <button
                onClick={() => { setShowUploadModal(false); setSelectedFile(null); }}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-500 mb-4">
                Upload a CSV file containing the lecturers data. Download the sample file below to see the required format.
              </p>

              <a
                href="/departmental-admin/documents/Lecturer_Sample_File.csv"
                download="Lecturer_Sample_File.csv"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 mb-4 transition-colors"
              >
                <FileUp size={16} />
                Download Sample CSV Template
              </a>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileUp size={28} className="text-blue-500" />
                    <p className="text-sm font-semibold text-slate-700">{selectedFile.name}</p>
                    <p className="text-xs text-slate-400">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={28} className="text-slate-300" />
                    <p className="text-sm font-medium text-slate-500">Click to select a file</p>
                    <p className="text-xs text-slate-400">Supports CSV, XLSX, XLS</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
              <button
                onClick={() => { setShowUploadModal(false); setSelectedFile(null); }}
                className="px-5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1D7AD9] text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading && <Loader2 size={16} className="animate-spin" />}
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
