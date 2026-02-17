
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Clock, ChevronDown } from 'lucide-react';
import authService from '../services/authService';

// Mock GPA performance data
const performanceData = [
  { name: 'Year 1', gpa: 3.2, cgpa: 3.2 },
  { name: 'Year 2', gpa: 2.5, cgpa: 2.85 },
  { name: 'Year 3', gpa: 4.5, cgpa: 3.4 },
  { name: 'Year 4', gpa: 3.8, cgpa: 3.5 },
  { name: 'Year 5', gpa: 3.0, cgpa: 3.4 },
];

// Mock announcements data
const announcements = [
  {
    title: 'Matriculation Date Released',
    description: 'The date had scheduled for 30th January has been cancelled. A new date will be announced soon.',
    date: '2025-01-01',
  },
  {
    title: 'Field Trip Rescheduled',
    description: 'The field trip to Calabar has been rescheduled. Please check back for the new date and further instructions.',
    date: '2025-01-05',
  },
  {
    title: 'Field Trip Rescheduled',
    description: 'The field trip to Calabar has been rescheduled. Please check back for the new date and further instructions.',
    date: '2025-01-02',
  },
  {
    title: 'About Mth 110 Test',
    description: 'The date had scheduled for 30th January has been cancelled. A new date will be announced soon.',
    date: '2025-01-02',
  },
];

// Mock timetable data
const timetableEntries = [
  { name: 'Electronic Engineering', code: 'CSC 201.1', time: '10:00 - 12:00am', highlighted: true },
  { name: 'Computer Science', code: 'CSC 200.1', time: '12:00 - 1:30pm', highlighted: false },
  { name: 'General  Studies', code: 'GES 200.1', time: '12:00 - 1:30pm', highlighted: false },
  { name: 'Computer Science', code: 'CSC 200.1', time: '12:00 - 1:30pm', highlighted: false },
  { name: 'Computer Science', code: 'CSC 200.1', time: '12:00 - 1:30pm', highlighted: false },
  { name: 'General  Studies', code: 'GES 200.1', time: '12:00 - 1:30pm', highlighted: false },
  { name: 'Computer Science', code: 'CSC 200.1', time: '12:00 - 1:30pm', highlighted: false },
  { name: 'Computer Science', code: 'CSC 200.1', time: '12:00 - 1:30pm', highlighted: false },
  { name: 'General  Studies', code: 'GES 200.1', time: '12:00 - 1:30pm', highlighted: false },
  { name: 'Computer Science', code: 'CSC 200.1', time: '12:00 - 1:30pm', highlighted: false },
];

const Dashboard: React.FC = () => {
  const user = authService.getStoredUser();
  const firstName = user?.fullName?.split(' ')[0] || 'Student';

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
              <span className="inline-block px-4 py-1.5 rounded-lg text-xs font-bold bg-[#dbeafe] text-[#3b82f6]">
                Pending
              </span>
            </div>

            {/* ID Card Status */}
            <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm">
              <p className="text-sm lg:text-[15px] font-bold text-[#1e293b] mb-4">
                ID Card Status
              </p>
              <span className="inline-block px-4 py-1.5 rounded-lg text-xs font-bold bg-[#dcfce7] text-[#22c55e]">
                Completed
              </span>
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
              {announcements.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-4 p-4 rounded-xl bg-[#f8fafc] border border-gray-50 hover:bg-[#f1f5f9] transition-colors cursor-pointer"
                >
                  <div className="flex gap-3 min-w-0">
                    {/* Blue left accent bar */}
                    <div className="w-1 flex-shrink-0 rounded-full bg-[#3b82f6] self-stretch" />
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-[#1e293b] truncate">{item.title}</p>
                      <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-300 whitespace-nowrap flex-shrink-0 mt-0.5">
                    {item.date}
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
                <select className="bg-[#f8fafc] border border-gray-100 text-[11px] font-bold rounded-lg px-4 py-2 text-gray-500 appearance-none pr-8 cursor-pointer">
                  <option>Today</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>

            <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-1 scrollbar-thin">
              {timetableEntries.map((entry, idx) => (
                <div
                  key={idx}
                  className={`p-4 lg:p-5 rounded-2xl transition-all ${
                    entry.highlighted
                      ? 'bg-[#3b82f6] text-white shadow-lg shadow-blue-200/40'
                      : 'bg-[#f8fafc] border border-gray-50 hover:bg-[#f1f5f9]'
                  }`}
                >
                  <h3
                    className={`font-bold text-[13px] lg:text-[14px] mb-1.5 ${
                      entry.highlighted ? 'text-white' : 'text-[#1e293b]'
                    }`}
                  >
                    {entry.name}
                  </h3>
                  <div
                    className={`flex items-center text-[10px] lg:text-[11px] font-bold gap-2 ${
                      entry.highlighted ? 'text-blue-100' : 'text-gray-400'
                    }`}
                  >
                    <span>{entry.code}</span>
                    <Clock size={11} />
                    <span>{entry.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
