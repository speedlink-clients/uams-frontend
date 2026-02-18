
import React, { useState, useEffect } from "react";
import { TrendingUp, CreditCard, Users, UserCheck } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Announcement, ChartDataItem } from "../types";
import { AnnouncementList } from "../components/AnnouncementList";
import StatsContainer from "../components/StatsContainer";
import { useAuth } from "../context/AuthProvider";
import api from "../api/axios";

// Placeholder announcements (could be moved to API later)
const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "Session Setup Complete",
    description: "Academic session 2024/2025 has been successfully initialized.",
    date: "2025-01-02",
  },
  {
    id: "2",
    title: "New Course Prerequisites",
    description: "Updated prerequisites for CSC 301. Please review the course catalog.",
    date: "2025-01-05",
  },
];

const Dashboard: React.FC = () => {
  const { authData } = useAuth();
  const [announcements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  
  const [revenueData, setRevenueData] = useState<ChartDataItem[]>([]);
  const [growthData, setGrowthData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
        setLoading(true);
        const [usersRes, transactionsRes] = await Promise.all([
            api.get("/university-admin/users"),
            api.get("/annual-access-fee/transactions-all")
        ]);

        // Process Transactions for Revenue Trend
        const transactions = transactionsRes.data.success ? transactionsRes.data.data : [];
        const revenueByYear: Record<string, number> = {};
        
        transactions.forEach((t: any) => {
            if (t.status === 'success') {
                const year = new Date(t.createdAt).getFullYear().toString();
                revenueByYear[year] = (revenueByYear[year] || 0) + t.amount;
            }
        });

        // Fill in missing recent years if empty to avoid broken chart
        const currentYear = new Date().getFullYear();
        for (let i = currentYear - 2; i <= currentYear + 1; i++) {
             const y = i.toString();
             if (!revenueByYear[y]) revenueByYear[y] = 0;
        }

        const formattedRevenueData = Object.keys(revenueByYear)
            .sort()
            .map(year => ({ year, value: revenueByYear[year] }));
        
        setRevenueData(formattedRevenueData);


        // Process Users for Enrollment Growth
        const users = usersRes.data.users || [];
        const growthByYear: Record<string, number> = {};

        users.forEach((u: any) => {
            if (u.role === 'STUDENT') {
                const year = new Date(u.createdAt).getFullYear().toString();
                 growthByYear[year] = (growthByYear[year] || 0) + 1;
            }
        });

         // Fill in missing recent years
         for (let i = currentYear - 2; i <= currentYear + 1; i++) {
            const y = i.toString();
            if (!growthByYear[y]) growthByYear[y] = 0;
       }

        const formattedGrowthData = Object.keys(growthByYear)
            .sort()
            .map(year => ({ year, value: growthByYear[year] }));

        setGrowthData(formattedGrowthData);

    } catch (error) {
        console.error("Failed to fetch dashboard chart data", error);
    } finally {
        setLoading(false);
    }
  };


  if (!authData) return null;

  // Get user display name
  const currentUser = authData.email 
    ? authData.email.split("@")[0] 
    : authData.role === "UNIVERSITYADMIN" ? "Admin" : "User";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* User info banner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Welcome Back, {currentUser}
          </h2>
          <p className="text-slate-500 mt-1">
            Logged in as{" "}
            <span className="font-semibold text-[#1d76d2]">
              DEPARTMENTAL ADMIN
            </span>
          </p>
        </div>
      </div>

      <StatsContainer />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-500" />{" "}
                Department Performance
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Fee collection (Annual)
              </p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData.length > 0 ? revenueData : [{year: '2024', value: 0}]}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="year"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickFormatter={(val) => `₦${val/1000}k`}
                />
                <Tooltip
                  formatter={(value: number) => [`₦${value.toLocaleString()}`, "Revenue"]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  dot={{
                    r: 4,
                    fill: "#22c55e",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="lg:col-span-1">
          <AnnouncementList announcements={announcements} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-bold text-slate-800">
              Enrollment Growth
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Student registration trends
            </p>
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData.length > 0 ? growthData : [{year: '2024', value: 0}]}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="year"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{
                  r: 4,
                  fill: "#3b82f6",
                  strokeWidth: 2,
                  stroke: "#fff",
                  name: "Students"
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
