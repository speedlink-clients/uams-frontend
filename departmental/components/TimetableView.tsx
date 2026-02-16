import React, { useState, useRef, useEffect } from "react";
import { Upload, ChevronDown, X, Loader2, FileUp } from "lucide-react";
import api from "../api/axios";
import toast, { Toaster } from "react-hot-toast";

// --- Interfaces matching API response ---
interface ApiTimetableEntry {
  id: string;
  dayOfWeek: string;
  startTime: string; // "08:30:00"
  endTime: string;   // "10:30:00"
  room: string;
  isPublished: boolean;
  Level: { id: string; name: string };
  Course: { id: string; code: string };
  Lecturer: {
    id: string;
    staffNumber: string;
    User: { id: string; fullName: string };
  };
  Semester: { id: string; name: string };
  Department: { id: string; name: string };
}

interface TimetableEntry {
  id: string;
  courseCode: string;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  level: string;
  levelId: string;
  room: string;
  lecturer: string;
  semester: string;
  isPublished: boolean;
}

// Color palette for course blocks (4 colors, cycling)
const COURSE_COLORS = [
  { bg: "#E1F7FD", text: "text-slate-900", timeBg: "text-slate-600" },
  { bg: "#FDFBE7", text: "text-slate-900", timeBg: "text-slate-600" },
  { bg: "#F0F1FE", text: "text-slate-900", timeBg: "text-slate-600" },
  { bg: "#FBF2F9", text: "text-slate-900", timeBg: "text-slate-600" },
];

// Time slots from 7 AM to 6 PM
const TIME_SLOTS = [
  "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const DAY_LABELS: Record<string, string> = {
  MONDAY: "Monday", TUESDAY: "Tuesday", WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday", FRIDAY: "Friday", SATURDAY: "Saturday", SUNDAY: "Sunday",
};

const DATE_FILTERS = ["Today", "This Week"];

export const TimetableView: React.FC = () => {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("This Week");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch timetable entries from API
  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const response = await api.get("/timetable/my-department");
      const data: ApiTimetableEntry[] = response.data?.data || [];

      const transformed: TimetableEntry[] = data.map((entry) => ({
        id: entry.id,
        courseCode: entry.Course?.code || "N/A",
        startTime: entry.startTime,
        endTime: entry.endTime,
        dayOfWeek: entry.dayOfWeek,
        level: entry.Level?.name || "N/A",
        levelId: entry.Level?.id || "",
        room: entry.room || "",
        lecturer: entry.Lecturer?.User?.fullName || "N/A",
        semester: entry.Semester?.name || "",
        isPublished: entry.isPublished,
      }));

      setEntries(transformed);
    } catch (err) {
      console.error("Failed to fetch timetable", err);
      toast.error("Failed to load timetable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  // Parse time string "HH:MM:SS" to hour number
  const parseTimeToHour = (time: string): number => {
    if (!time) return 0;
    const parts = time.split(":");
    if (parts.length < 2) return 0;
    return parseInt(parts[0]) + parseInt(parts[1]) / 60;
  };

  // Format "HH:MM:SS" to "H:MMAM/PM"
  const formatTime = (time: string): string => {
    if (!time) return "";
    const parts = time.split(":");
    if (parts.length < 2) return time;
    let hour = parseInt(parts[0]);
    const minutes = parts[1];
    const ampm = hour >= 12 ? "PM" : "AM";
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minutes}${ampm}`;
  };

  // Get today's day name
  const getTodayName = (): string => {
    const dayIndex = new Date().getDay(); // 0=Sunday
    const dayMap = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    return dayMap[dayIndex];
  };

  // Get unique levels from data for filter dropdown
  const uniqueLevels = Array.from(
    new Map(entries.map(e => [e.levelId, e.level])).entries()
  ).map(([id, name]) => ({ id, name }));

  // Filter entries
  const getFilteredEntries = (): TimetableEntry[] => {
    let filtered = entries;

    if (levelFilter !== "all") {
      filtered = filtered.filter(e => e.levelId === levelFilter);
    }

    if (dateFilter === "Today") {
      const today = getTodayName();
      filtered = filtered.filter(e => e.dayOfWeek === today);
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

      await api.post("/timetable/bulk-upload-timetable", formData, {
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

  // Group entries by day for "This Week" view
  const groupedByDay = DAYS.reduce<Record<string, TimetableEntry[]>>((acc, day) => {
    const dayEntries = filteredEntries
      .filter(e => e.dayOfWeek === day)
      .sort((a, b) => parseTimeToHour(a.startTime) - parseTimeToHour(b.startTime));
    if (dayEntries.length > 0) acc[day] = dayEntries;
    return acc;
  }, {});

  // For "Today" view, just sort by time
  const todayEntries = filteredEntries.sort(
    (a, b) => parseTimeToHour(a.startTime) - parseTimeToHour(b.startTime)
  );

  // Hour map for time slot matching
  const hourMap: Record<string, number> = {
    "7:00 AM": 7, "8:00 AM": 8, "9:00 AM": 9, "10:00 AM": 10, "11:00 AM": 11,
    "12:00 PM": 12, "1:00 PM": 13, "2:00 PM": 14, "3:00 PM": 15, "4:00 PM": 16, "5:00 PM": 17,
  };

  // Render a timeline for a set of entries
  const renderTimeline = (entriesToRender: TimetableEntry[], globalColorOffset = 0) => (
    <div className="relative">
      {TIME_SLOTS.map((timeSlot) => {
        const currentSlotHour = hourMap[timeSlot] || 8;

        const slotEntries = entriesToRender.filter(entry => {
          const entryHour = parseTimeToHour(entry.startTime);
          return Math.floor(entryHour) === currentSlotHour;
        });

        return (
          <div key={timeSlot} className="flex items-start gap-6 min-h-[60px]">
            <div className="w-20 flex-shrink-0 text-right pt-1">
              <span className="text-xs font-medium text-slate-400">{timeSlot}</span>
            </div>
            <div className="flex-1 border-t border-slate-100 pt-2 pb-4">
              {slotEntries.map((entry) => {
                const color = getCourseColor(
                  globalColorOffset + entriesToRender.indexOf(entry)
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
                      {entry.courseCode}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      {entry.room && (
                        <p className={`text-[11px] ${color.timeBg}`}>
                          📍 {entry.room}
                        </p>
                      )}
                      {entry.lecturer && entry.lecturer !== "N/A" && (
                        <p className={`text-[11px] ${color.timeBg}`}>
                          👤 {entry.lecturer}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
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
            <option value="all">All Levels</option>
            {uniqueLevels.map(level => (
              <option key={level.id} value={level.id}>{level.name}</option>
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

      {/* Timetable Content */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            <span className="ml-2 text-sm text-slate-500 font-medium">Loading timetable…</span>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <p className="text-sm font-medium">No timetable entries found</p>
            <p className="text-xs mt-1">Try adjusting your filters or upload a timetable</p>
          </div>
        ) : dateFilter === "Today" ? (
          /* Today view — single timeline */
          <div className="p-6">
            {renderTimeline(todayEntries)}
          </div>
        ) : (
          /* This Week view — grouped by day */
          <div className="p-6">
            {Object.entries(groupedByDay).map(([day, dayEntries], dayIndex) => (
              <div key={day} className={dayIndex > 0 ? "mt-8" : ""}>
                <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">
                  {DAY_LABELS[day] || day}
                </h3>
                {renderTimeline(dayEntries, dayIndex * 10)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Upload Timetable</h3>
              <button
                onClick={() => { setShowUploadModal(false); setSelectedFile(null); }}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-500 mb-4">
                Upload a CSV file containing the timetable data. Download the sample file below to see the required format.
              </p>

              <a
                href="/documents/TIMETABLE_SAMPLE_FILE.csv"
                download
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
