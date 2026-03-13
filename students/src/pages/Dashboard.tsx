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
import { Clock, ChevronDown, Loader2, Calendar } from 'lucide-react';
import authService from '../services/authService';
import apiClient from '../services/api';
import { useNavigate } from 'react-router'; 

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
  const navigate = useNavigate(); 
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
    apiClient.get('/timetable/my-level')
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setTimetableData(Array.isArray(data) ? data : []);
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
    apiClient.get('/students/registrations')
      .then((res) => {
        const regs = res.data?.registrations ?? res.data?.data?.registrations ?? [];
        const hasConfirmed = Array.isArray(regs) && regs.some(
          (r: any) => r.status === 'confirmed' || r.status === 'registered'
        );
        setCourseRegStatus(hasConfirmed ? 'registered' : (regs.length > 0 ? 'registered' : 'pending'));
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
    return timetableData
      .filter((e) => e.dayOfWeek === selectedDay && e.isPublished)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [timetableData, selectedDay]);

  
  const handleNavigateToTimetable = () => {
    navigate('/timetable');
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6 lg:space-y-8">
      {/* Single column layout  */}
      <div className="space-y-6 lg:space-y-8">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#1e293b]">
            Hello <span className="font-extrabold">{firstName},</span>
          </h1>
          <p className="text-gray-400 text-sm lg:text-base mt-1">Welcome back</p>
        </div>

        {/* Status Cards Row  */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Courses Registration Status - Compact */}
          <div className="bg-white rounded-2xl lg:rounded-3xl p-5 border border-gray-100 shadow-sm">
            <p className="text-xs lg:text-sm font-bold text-[#1e293b] mb-3">
              Courses Registration Status
            </p>
            {courseRegStatus === 'loading' ? (
              <span className="inline-block px-3 py-1 rounded-lg text-[10px] font-bold bg-gray-100 text-gray-400">Loading...</span>
            ) : courseRegStatus === 'registered' ? (
              <span className="inline-block px-3 py-1 rounded-lg text-[10px] font-bold bg-[#dcfce7] text-[#22c55e]">Registered</span>
            ) : (
              <span className="inline-block px-3 py-1 rounded-lg text-[10px] font-bold bg-[#dbeafe] text-[#3b82f6]">Pending</span>
            )}
          </div>

          {/* ID Card Status - Compact */}
          <div className="bg-white rounded-2xl lg:rounded-3xl p-5 border border-gray-100 shadow-sm">
            <p className="text-xs lg:text-sm font-bold text-[#1e293b] mb-3">
              ID Card Status
            </p>
            {idCardStatus === 'loading' ? (
              <span className="inline-block px-3 py-1 rounded-lg text-[10px] font-bold bg-gray-100 text-gray-400">Loading...</span>
            ) : idCardStatus === 'paid' ? (
              <span className="inline-block px-3 py-1 rounded-lg text-[10px] font-bold bg-[#dcfce7] text-[#22c55e]">Paid</span>
            ) : (
              <span className="inline-block px-3 py-1 rounded-lg text-[10px] font-bold bg-[#fef9c3] text-[#ca8a04]">Not Paid</span>
            )}
          </div>

          {/* Timetable  */}
          <div className="bg-white rounded-2xl lg:rounded-3xl p-5 border border-gray-100 shadow-sm">
            <h2 className="text-xs lg:text-sm font-bold text-[#1e293b] mb-3">
              Timetable
            </h2>
            
            {/* Navigation Box to Timetable Page*/}
            <button
              onClick={handleNavigateToTimetable}
              className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-4 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-lg p-2">
                    <Calendar size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">View Full Timetable</p>
                    
                  </div>
                </div>
                <div className="bg-white/20 rounded-full p-1.5">
                  <ChevronDown size={16} className="rotate-[-90deg] text-white" />
                </div>
              </div>
            </button>

            {/* Optional: Quick info about today's classes */}
            {!timetableLoading && todayClasses.length > 0 && (
              <div className="mt-3 text-[10px] text-gray-500 flex items-center gap-1">
                <Clock size={10} className="text-blue-400" />
                <span>{todayClasses.length} class{todayClasses.length !== 1 ? 'es' : ''} today</span>
              </div>
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

          <div className="h-60 lg:h-96 w-full">
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
    </div>
  );
};

export default Dashboard;