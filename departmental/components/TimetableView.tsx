"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, ChevronDown, X, Loader2, FileUp } from "lucide-react";
import api from "../api/axios";
import toast, { Toaster } from "react-hot-toast";

// --- Interfaces ---
interface TimetableEntry {
  id: string;
  courseTitle: string;
  courseCode: string;
  startTime: string; // "08:00"
  endTime: string;   // "08:45"
  day: string;
  level: string;
  venue?: string;
  color?: string;
}

// Color palette for course blocks (4 colors, cycling)
const COURSE_COLORS = [
  { bg: "#E1F7FD", text: "text-slate-900", timeBg: "text-slate-600" },
  { bg: "#FDFBE7", text: "text-slate-900", timeBg: "text-slate-600" },
  { bg: "#F0F1FE", text: "text-slate-900", timeBg: "text-slate-600" },
  { bg: "#FBF2F9", text: "text-slate-900", timeBg: "text-slate-600" },
];

// Time slots from 8 AM to 5 PM
const TIME_SLOTS = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const LEVELS = ["100", "200", "300", "400", "500"];

const DATE_FILTERS = ["Today", "This Week", "This Month"];

export const TimetableView: React.FC = () => {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("Today");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch timetable entries
  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (levelFilter !== "all") params.level = levelFilter;

      const response = await api.get("/university-admin/timetable", { params });
      const data = response.data?.timetable || response.data?.data || [];

      const transformed: TimetableEntry[] = Array.isArray(data)
        ? data.map((entry: any, index: number) => ({
            id: entry.id || String(index),
            courseTitle: entry.courseTitle || entry.course_title || entry.title || "Untitled",
            courseCode: entry.courseCode || entry.course_code || "",
            startTime: entry.startTime || entry.start_time || "",
            endTime: entry.endTime || entry.end_time || "",
            day: entry.day || "",
            level: entry.level || "",
            venue: entry.venue || entry.location || "",
          }))
        : [];

      setEntries(transformed);
    } catch (err) {
      console.error("Failed to fetch timetable", err);
      // Use sample data for demonstration
      setEntries(getSampleData());
    } finally {
      setLoading(false);
    }
  };

  // Sample data matching the design
  const getSampleData = (): TimetableEntry[] => [
    { id: "1", courseTitle: "Math", courseCode: "MTH101", startTime: "08:00", endTime: "08:45", day: "Monday", level: "100" },
    { id: "2", courseTitle: "English", courseCode: "ENG101", startTime: "09:00", endTime: "09:45", day: "Monday", level: "100" },
    { id: "3", courseTitle: "Biology", courseCode: "BIO101", startTime: "10:00", endTime: "10:45", day: "Monday", level: "100" },
    { id: "4", courseTitle: "Physics", courseCode: "PHY101", startTime: "11:00", endTime: "11:45", day: "Monday", level: "100" },
    { id: "5", courseTitle: "Chemistry", courseCode: "CHM101", startTime: "13:00", endTime: "13:45", day: "Monday", level: "100" },
    { id: "6", courseTitle: "History", courseCode: "HIS101", startTime: "14:00", endTime: "14:45", day: "Monday", level: "100" },
    { id: "7", courseTitle: "Computer Science", courseCode: "CSC201", startTime: "08:00", endTime: "09:45", day: "Tuesday", level: "200" },
    { id: "8", courseTitle: "Data Structures", courseCode: "CSC202", startTime: "10:00", endTime: "11:45", day: "Tuesday", level: "200" },
    { id: "9", courseTitle: "Algorithms", courseCode: "CSC301", startTime: "09:00", endTime: "10:45", day: "Wednesday", level: "300" },
    { id: "10", courseTitle: "Operating Systems", courseCode: "CSC302", startTime: "13:00", endTime: "14:45", day: "Wednesday", level: "300" },
  ];

  useEffect(() => {
    fetchTimetable();
  }, [levelFilter]);

  // Parse time string like "08:00" or "8:00 AM" to hour number
  const parseTimeToHour = (time: string): number => {
    if (!time) return 0;
    const parts = time.match(/(\d+):(\d+)/);
    if (!parts) return 0;
    let hour = parseInt(parts[1]);
    const minutes = parseInt(parts[2]);
    if (time.toLowerCase().includes("pm") && hour !== 12) hour += 12;
    if (time.toLowerCase().includes("am") && hour === 12) hour = 0;
    return hour + minutes / 60;
  };

  // Format time for display
  const formatTime = (time: string): string => {
    if (!time) return "";
    const parts = time.match(/(\d+):(\d+)/);
    if (!parts) return time;
    let hour = parseInt(parts[1]);
    const minutes = parts[2];
    const ampm = hour >= 12 ? "PM" : "AM";
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minutes}${ampm}`;
  };

  // Get today's day name
  const getTodayName = (): string => {
    return DAYS[new Date().getDay() - 1] || "Monday";
  };

  // Filter entries based on date and level
  const getFilteredEntries = (): TimetableEntry[] => {
    let filtered = entries;

    if (levelFilter !== "all") {
      filtered = filtered.filter(e => e.level === levelFilter);
    }

    if (dateFilter === "Today") {
      const today = getTodayName();
      filtered = filtered.filter(e => e.day === today);
    }

    return filtered;
  };

  // Get color for a course
  const getCourseColor = (index: number) => {
    return COURSE_COLORS[index % COURSE_COLORS.length];
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("timetable", selectedFile);
      if (levelFilter !== "all") formData.append("level", levelFilter);

      await api.post("/university-admin/timetable/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Timetable uploaded successfully!");
      setShowUploadModal(false);
      setSelectedFile(null);
      fetchTimetable();
    } catch (err: any) {
      console.error("Upload failed", err);
      toast.error(err?.response?.data?.message || "Failed to upload timetable");
    } finally {
      setUploading(false);
    }
  };

  const filteredEntries = getFilteredEntries();

  // Get the current day's entries grouped for the timeline view
  const timelineEntries = filteredEntries.sort(
    (a, b) => parseTimeToHour(a.startTime) - parseTimeToHour(b.startTime)
  );

  return (
    <div className="p-6 md:p-10 min-h-screen bg-[#f8fafc]">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Time Table</h2>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1D7AD9] text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Upload size={16} />
          Upload Timetable
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        {/* Level Filter */}
        <div className="relative">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="appearance-none px-5 py-2.5 pr-10 border border-slate-200 bg-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium text-slate-700 cursor-pointer"
          >
            <option value="all">Level</option>
            {LEVELS.map(level => (
              <option key={level} value={level}>Level {level}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Date Filter */}
        <div className="relative">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="appearance-none px-5 py-2.5 pr-10 border border-slate-200 bg-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium text-slate-700 cursor-pointer"
          >
            {DATE_FILTERS.map(filter => (
              <option key={filter} value={filter}>{filter}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Timetable Timeline */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            <span className="ml-2 text-sm text-slate-500 font-medium">Loading timetable…</span>
          </div>
        ) : timelineEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <p className="text-sm font-medium">No timetable entries found</p>
            <p className="text-xs mt-1">Try adjusting your filters or upload a timetable</p>
          </div>
        ) : (
          <div className="p-6">
            {/* Timeline */}
            <div className="relative">
              {TIME_SLOTS.map((timeSlot, slotIndex) => {
                const slotHour = parseTimeToHour(
                  timeSlot.replace(" AM", ":00 AM").replace(" PM", ":00 PM")
                    .replace("8:00 AM", "08:00").replace("9:00 AM", "09:00")
                    .replace("10:00 AM", "10:00").replace("11:00 AM", "11:00")
                    .replace("12:00 PM", "12:00").replace("1:00 PM", "13:00")
                    .replace("2:00 PM", "14:00").replace("3:00 PM", "15:00")
                    .replace("4:00 PM", "16:00")
                );

                // Simple hour mapping
                const hourMap: Record<string, number> = {
                  "8:00 AM": 8, "9:00 AM": 9, "10:00 AM": 10, "11:00 AM": 11,
                  "12:00 PM": 12, "1:00 PM": 13, "2:00 PM": 14, "3:00 PM": 15, "4:00 PM": 16,
                };
                const currentSlotHour = hourMap[timeSlot] || 8;

                // Find entries that start in this hour
                const slotEntries = timelineEntries.filter(entry => {
                  const entryHour = parseTimeToHour(entry.startTime);
                  return Math.floor(entryHour) === currentSlotHour;
                });

                return (
                  <div key={timeSlot} className="flex items-start gap-6 min-h-[60px]">
                    {/* Time label */}
                    <div className="w-20 flex-shrink-0 text-right pt-1">
                      <span className="text-xs font-medium text-slate-400">{timeSlot}</span>
                    </div>

                    {/* Divider and content */}
                    <div className="flex-1 border-t border-slate-100 pt-2 pb-4">
                      {slotEntries.map((entry, entryIndex) => {
                        const color = getCourseColor(
                          timelineEntries.indexOf(entry)
                        );
                        return (
                          <div
                            key={entry.id}
                            style={{ backgroundColor: color.bg }}
                            className="rounded-xl px-4 py-3 mb-2 transition-all hover:shadow-sm"
                          >
                            <p className={`text-[11px] font-semibold ${color.timeBg} mb-1`}>
                              {formatTime(entry.startTime)}-{formatTime(entry.endTime)}
                            </p>
                            <p className={`text-sm font-bold ${color.text}`}>
                              {entry.courseTitle}
                            </p>
                            {entry.venue && (
                              <p className={`text-[11px] ${color.timeBg} mt-0.5`}>
                                {entry.venue}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Upload Timetable</h3>
              <button
                onClick={() => { setShowUploadModal(false); setSelectedFile(null); }}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-sm text-slate-500 mb-4">
                Upload a CSV or Excel file containing the timetable data. The file should include columns for course title, time, day, and level.
              </p>

              {/* Level selector for upload */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Level (Optional)</label>
                <select
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                >
                  <option value="">All Levels</option>
                  {LEVELS.map(level => (
                    <option key={level} value={level}>Level {level}</option>
                  ))}
                </select>
              </div>

              {/* File Drop Zone */}
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
                    <p className="text-sm font-medium text-slate-500">
                      Click to select a file
                    </p>
                    <p className="text-xs text-slate-400">
                      Supports CSV, XLSX, XLS
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
              <button
                onClick={() => { setShowUploadModal(false); setSelectedFile(null); }}
                className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1D7AD9] text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading && <Loader2 size={16} className="animate-spin" />}
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableView;
