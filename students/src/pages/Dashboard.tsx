
import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Clock, ChevronDown, Loader2 } from 'lucide-react';
import authService from '../services/authService';
import apiClient from '../services/api';

// Mock GPA performance data
const performanceData = [
  { name: 'Year 1', gpa: 3.2, cgpa: 3.2 },
  { name: 'Year 2', gpa: 2.5, cgpa: 2.85 },
  { name: 'Year 3', gpa: 4.5, cgpa: 3.4 },
  { name: 'Year 4', gpa: 3.8, cgpa: 3.5 },
  { name: 'Year 5', gpa: 3.0, cgpa: 3.4 },
];



const DAY_NAMES = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type TimetableEntry = {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
  isPublished: boolean;
  Course: { code: string; title: string };
  Lecturer: { User: { fullName: string } };
};

const formatTime = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, '0')}${ampm}`;
};

const Dashboard: React.FC = () => {
  const user = authService.getStoredUser();
  const firstName = user?.fullName?.split(' ')[0] || 'Student';

  const [timetableData, setTimetableData] = useState<TimetableEntry[]>([]);
  const [timetableLoading, setTimetableLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(() => DAY_NAMES[new Date().getDay()]);
  const [courseRegStatus, setCourseRegStatus] = useState<'loading' | 'registered' | 'pending'>('loading');
  const [idCardStatus, setIdCardStatus] = useState<'loading' | 'paid' | 'not_paid'>('loading');
  const [notifAnnouncements, setNotifAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    // Fetch timetable
    apiClient.get('/timetables')
      .then((res) => {
        const data = res.data?.data ?? res.data;
        console.log("DASHBOARD TIMETABLE DATA:", data);
        
        let flattened: TimetableEntry[] = [];
        const items = Array.isArray(data) ? data : (data?.schedule ? [data] : []);

        if (items.length > 0) {
            items.forEach((item: any) => {
                if (item.schedule) {
                    Object.entries(item.schedule).forEach(([day, slots]: [string, any]) => {
                        if (Array.isArray(slots)) {
                            slots.forEach((slot: any) => {
                                flattened.push({
                                    id: slot.courseId || Math.random().toString(),
                                    dayOfWeek: day.toUpperCase(),
                                    startTime: slot.startTime,
                                    endTime: slot.endTime,
                                    isPublished: true, 
                                    Course: {
                                        code: slot.courseCode,
                                        title: slot.originalText || slot.courseCode
                                    },
                                    Lecturer: {
                                        User: { fullName: '' } 
                                    },
                                    room: '' 
                                });
                            });
                        }
                    });
                }
            });
        }
        
        if (flattened.length > 0) {
           setTimetableData(flattened);
        } else if (Array.isArray(data) && !data.some(d => d.schedule)) {
           // Fallback to old flat format if returned
           setTimetableData(data);
        } else {
           setTimetableData([]);
        }
      })
      .catch((err) => console.error('Failed to fetch timetable:', err))
      .finally(() => setTimetableLoading(false));

    // Fetch notifications for announcements
    apiClient.get('/notifications')
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setNotifAnnouncements(Array.isArray(data) ? data.slice(0, 4) : []);
      })
      .catch(() => {});

    // Fetch course registration status
    apiClient.get('/students/courses')
      .then((res) => {
        const yearData = res.data?.data;
        if (!yearData) {
            setCourseRegStatus('pending');
            return;
        }
        
        let isAnyCourseRegistered = false;
        
        // Traverse through AcademicYear -> Level -> Semester -> Courses
        Object.values(yearData).forEach((levelData: any) => {
            Object.values(levelData).forEach((semesterData: any) => {
                Object.values(semesterData).forEach((courses: any) => {
                    if (Array.isArray(courses) && courses.some((c: any) => c.isRegistered)) {
                        isAnyCourseRegistered = true;
                    }
                });
            });
        });
        
        setCourseRegStatus(isAnyCourseRegistered ? 'registered' : 'pending');
      })
      .catch(() => setCourseRegStatus('pending'));

    // Fetch payments to check ID card status
    apiClient.get('/student/payments')
      .then((res) => {
        const payments = res.data?.data?.payments ?? res.data?.payments ?? [];
        const idCardPaid = Array.isArray(payments) && payments.some(
          (p: any) => p.paymentType?.toUpperCase() === 'ID CARD FEE' && p.status?.toLowerCase() === 'success'
        );
        setIdCardStatus(idCardPaid ? 'paid' : 'not_paid');
      })
      .catch(() => setIdCardStatus('not_paid'));
  }, []);

  const todayClasses = useMemo(() => {
    const classes = timetableData
      .filter((e) => e.dayOfWeek === selectedDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    console.log(`Classes for ${selectedDay}:`, classes);
    return classes;
  }, [timetableData, selectedDay]);

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6 lg:space-y-8">
      <div className="grid grid-cols-12 gap-6 lg:gap-8">

        {/* ===== Left Column ===== */}
        <div className="col-span-12 lg:col-span-8 space-y-6 lg:space-y-8">

          {/* Greeting */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1e293b]">
              Hello <span className="font-extrabold">{firstName},</span>
            </h1>
            <p className="text-gray-400 text-sm lg:text-base mt-1">Welcome back</p>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {/* Courses Registration Status */}
            <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm">
              <p className="text-sm lg:text-[15px] font-bold text-[#1e293b] mb-4">
                Courses Registration Status
              </p>
              {courseRegStatus === 'loading' ? (
                <span className="inline-block px-4 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-400">Loading...</span>
              ) : courseRegStatus === 'registered' ? (
                <span className="inline-block px-4 py-1.5 rounded-lg text-xs font-bold bg-[#dcfce7] text-[#22c55e]">Registered</span>
              ) : (
                <span className="inline-block px-4 py-1.5 rounded-lg text-xs font-bold bg-[#dbeafe] text-[#3b82f6]">Pending</span>
              )}
            </div>

            {/* ID Card Status */}
            <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm">
              <p className="text-sm lg:text-[15px] font-bold text-[#1e293b] mb-4">
                ID Card Status
              </p>
              {idCardStatus === 'loading' ? (
                <span className="inline-block px-4 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-400">Loading...</span>
              ) : idCardStatus === 'paid' ? (
                <span className="inline-block px-4 py-1.5 rounded-lg text-xs font-bold bg-[#dcfce7] text-[#22c55e]">Paid</span>
              ) : (
                <span className="inline-block px-4 py-1.5 rounded-lg text-xs font-bold bg-[#fef9c3] text-[#ca8a04]">Not Paid</span>
              )}
            </div>
          </div>

          {/* Academic Performance Chart */}
          <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6 lg:mb-8">
              <h2 className="text-base lg:text-lg font-bold text-[#1e293b]">Academic Performance</h2>
              <div className="relative">
                <select className="bg-[#f8fafc] border border-gray-100 text-[11px] font-bold rounded-lg px-4 py-2 text-gray-500 appearance-none pr-8 cursor-pointer">
                  <option>All Time</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>

            <div className="h-60 lg:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                    dy={10}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                    domain={[0, 5]}
                    ticks={[0, 1.0, 2.0, 3.0, 4.0, 5.0]}
                    tickFormatter={(value: number) => value.toFixed(1)}
                    width={35}
                  />
                  <Tooltip
                    cursor={{ stroke: '#f1f5f9' }}
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gpa"
                    stroke="#22c55e"
                    strokeWidth={2.5}
                    dot={{ r: 0 }}
                    activeDot={{ r: 5, fill: '#22c55e', stroke: '#fff', strokeWidth: 2.5 }}
                    name="GPA"
                  />
                  <Line
                    type="monotone"
                    dataKey="cgpa"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    dot={{ r: 0 }}
                    activeDot={{ r: 5, fill: '#ef4444', stroke: '#fff', strokeWidth: 2.5 }}
                    name="CGPA"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base lg:text-lg font-bold text-[#1e293b]">Announcements</h2>
              <button className="bg-[#3b82f6] text-white text-[11px] font-bold px-4 py-1.5 rounded-lg hover:bg-blue-600 transition-colors">
                See All
              </button>
            </div>

            <div className="space-y-3">
              {notifAnnouncements.length === 0 ? (
                <p className="text-[12px] text-gray-400 text-center py-4">No announcements</p>
              ) : notifAnnouncements.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 p-4 rounded-xl bg-[#f8fafc] border border-gray-50 hover:bg-[#f1f5f9] transition-colors cursor-pointer"
                >
                  <div className="flex gap-3 min-w-0">
                    {/* Blue left accent bar */}
                    <div className="w-1 flex-shrink-0 rounded-full bg-[#3b82f6] self-stretch" />
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-[#1e293b] truncate">{item.title}</p>
                      <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-300 whitespace-nowrap flex-shrink-0 mt-0.5">
                    {new Date(item.createdAt).toISOString().split('T')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== Right Column — Timetable ===== */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm lg:sticky lg:top-8">
            <div className="flex justify-between items-center mb-6 lg:mb-8">
              <h2 className="text-base lg:text-lg font-bold text-[#1e293b]">Timetable</h2>
              <div className="relative">
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value as typeof DAY_NAMES[number])}
                  className="bg-[#f8fafc] border border-gray-100 text-[11px] font-bold rounded-lg px-4 py-2 text-gray-500 appearance-none pr-8 cursor-pointer"
                >
                  {DAY_NAMES.map((day, idx) => (
                    <option key={day} value={day} style={{ background: 'white', color: '#1e293b' }}>{DAY_LABELS[idx]}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>

            <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-1 scrollbar-thin">
              {timetableLoading ? (
                <div className="flex items-center justify-center py-12 gap-2">
                  <Loader2 size={18} className="animate-spin text-blue-500" />
                  <span className="text-sm text-gray-400 font-medium">Loading...</span>
                </div>
              ) : todayClasses.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm font-bold text-gray-400">No classes</p>
                  <p className="text-[11px] text-gray-300 mt-1">No classes scheduled for {DAY_LABELS[DAY_NAMES.indexOf(selectedDay)]}</p>
                </div>
              ) : (
                todayClasses.map((entry, idx) => (
                  <div
                    key={entry.id}
                    className={`p-4 lg:p-5 rounded-2xl transition-all ${
                      idx === 0
                        ? 'bg-[#3b82f6] text-white shadow-lg shadow-blue-200/40'
                        : 'bg-[#f8fafc] border border-gray-50 hover:bg-[#f1f5f9]'
                    }`}
                  >
                    <h3
                      className={`font-bold text-[13px] lg:text-[14px] mb-1.5 ${
                        idx === 0 ? 'text-white' : 'text-[#1e293b]'
                      }`}
                    >
                      {entry.Course.title}
                    </h3>
                    <div
                      className={`flex items-center text-[10px] lg:text-[11px] font-bold gap-2 ${
                        idx === 0 ? 'text-blue-100' : 'text-gray-400'
                      }`}
                    >
                      <span>{entry.Course.code}</span>
                      <Clock size={11} />
                      <span>{formatTime(entry.startTime)} - {formatTime(entry.endTime)}</span>
                    </div>
                    <p
                      className={`text-[10px] mt-1 font-medium ${
                        idx === 0 ? 'text-blue-200' : 'text-gray-300'
                      }`}
                    >
                      {entry.room} • {entry.Lecturer.User.fullName}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
