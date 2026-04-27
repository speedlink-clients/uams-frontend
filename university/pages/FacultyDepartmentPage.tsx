import React, { useState, useMemo } from "react";
import { Search, Plus, MoreHorizontal, Eye, Edit2, Trash2, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import { CreateFacultyModal } from "../components/CreateFacultyModal";
import { CreateDepartmentModal } from "../components/CreateDepartmentModal";

// --- Mock Data ---
const initialFaculties = [
  { id: "FAC-001", name: "Science", dean: "Dr. Sarah Johnson", status: "Active" },
  { id: "FAC-002", name: "Engineering", dean: "Prof. Michael Chen", status: "Active" },
  { id: "FAC-003", name: "Arts", dean: "Dr. Emily Brown", status: "Not Active" },
];

const initialDepartments = [
  { id: "DEP-001", name: "Computer Science", faculty: "Science", hod: "Dr. Alan Turing", status: "Active" },
  { id: "DEP-002", name: "Mechanical Engineering", faculty: "Engineering", hod: "Prof. Henry Ford", status: "Active" },
  { id: "DEP-003", name: "English Literature", faculty: "Arts", hod: "Dr. Jane Austen", status: "Pending" },
];

// --- Generic Table Component ---
const DataTable = ({ 
  title, 
  data, 
  columns, 
  onAdd 
}: { 
  title: string, 
  data: any[], 
  columns: { header: string, accessor: string, isStatus?: boolean }[],
  onAdd: () => void 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [activeMenuIdx, setActiveMenuIdx] = useState<number | null>(null);

  const filteredData = useMemo(() => {
    return data.filter(item => 
      Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [data, searchTerm]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="w-full pl-11 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={onAdd}
            className="bg-[#1b75d0] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-[0_4px_10px_rgb(27,117,208,0.2)] hover:bg-blue-700 hover:shadow-[0_4px_15px_rgb(27,117,208,0.3)] transition-all"
          >
            <Plus className="w-4 h-4" /> Add New
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-slate-50/50">
              <tr className="border-b border-slate-100">
                {columns.map((col, i) => (
                  <th key={i} className={`p-5 text-slate-400 font-bold text-xs uppercase ${col.isStatus ? 'text-center' : ''}`}>
                    {col.header}
                  </th>
                ))}
                <th className="p-5 text-slate-400 font-bold text-xs uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="p-10 text-center text-slate-400 font-medium text-sm">
                    No records found.
                  </td>
                </tr>
              ) : (
                currentData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-all">
                    {columns.map((col, i) => (
                      <td key={i} className={`p-5 text-xs ${i === 0 ? 'font-black text-slate-800' : 'font-bold text-slate-600'} ${col.isStatus ? 'text-center' : ''}`}>
                        {col.isStatus ? (
                          <StatusBadge status={row[col.accessor]} />
                        ) : (
                          row[col.accessor]
                        )}
                      </td>
                    ))}
                    <td className="p-5 relative text-right">
                      <button
                        onClick={() => setActiveMenuIdx(activeMenuIdx === idx ? null : idx)}
                        className="p-2 hover:bg-slate-200 rounded-xl transition-colors"
                      >
                        <MoreHorizontal className="w-5 h-5 text-slate-400" />
                      </button>
                      {activeMenuIdx === idx && (
                        <div className="absolute right-10 top-10 w-32 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                          <button className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 text-slate-600 text-xs font-medium border-b border-slate-50">
                            <Eye className="w-4 h-4 text-slate-400" /> View
                          </button>
                          <button className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 text-slate-600 text-xs font-medium border-b border-slate-50">
                            <Edit2 className="w-4 h-4 text-slate-400" /> Edit
                          </button>
                          <button className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 text-red-500 text-xs font-medium">
                            <Trash2 className="w-4 h-4 text-red-400" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalItems > 0 && (
          <div className="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-medium text-slate-500 bg-slate-50/30">
            <div>
              Showing <span className="text-slate-900">{startIndex + 1}</span>–<span className="text-slate-900">{endIndex}</span> of <span className="text-slate-900">{totalItems}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-white transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg">
                <span className="text-slate-900">{currentPage}</span> / {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-white transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Page Component ---
const FacultyDepartmentPage: React.FC = () => {
  const [faculties, setFaculties] = useState(initialFaculties);
  const [departments, setDepartments] = useState(initialDepartments);
  
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);

  return (
    <div className="space-y-10 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Faculty & Department</h2>
        <p className="text-sm font-medium text-slate-500">Manage university faculties and their respective departments</p>
      </div>

      <div className="space-y-12">
        {/* Faculties Section */}
        <DataTable 
          title="Faculties" 
          data={faculties} 
          columns={[
            { header: "Code", accessor: "id" },
            { header: "Name", accessor: "name" },
            { header: "Dean", accessor: "dean" },
            { header: "Status", accessor: "status", isStatus: true },
          ]}
          onAdd={() => setShowFacultyModal(true)}
        />

        <div className="h-px bg-slate-200 w-full rounded-full"></div>

        {/* Departments Section */}
        <DataTable 
          title="Departments" 
          data={departments} 
          columns={[
            { header: "Code", accessor: "id" },
            { header: "Name", accessor: "name" },
            { header: "Faculty", accessor: "faculty" },
            { header: "H.O.D", accessor: "hod" },
            { header: "Status", accessor: "status", isStatus: true },
          ]}
          onAdd={() => setShowDepartmentModal(true)}
        />
      </div>

      {showFacultyModal && (
        <CreateFacultyModal
          onClose={() => setShowFacultyModal(false)}
          onSave={(newFaculty) => {
            setFaculties((prev) => [newFaculty, ...prev]);
          }}
        />
      )}

      {showDepartmentModal && (
        <CreateDepartmentModal
          onClose={() => setShowDepartmentModal(false)}
          onSave={(newDept) => {
            setDepartments((prev) => [newDept, ...prev]);
          }}
        />
      )}
    </div>
  );
};

export default FacultyDepartmentPage;
