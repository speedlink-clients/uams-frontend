
import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Filter, Download, Calendar, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { toast } from "react-hot-toast";

// API Types
interface StudentInfo {
  studentId: string;
  registrationNo: string | null;
  fullName: string;
  email: string;
}

interface TransactionData {
  id: string;
  reference: string;
  amount: number;
  status: "success" | "pending" | "failed";
  paymentType: string;
  paymentMethod: string | null;
  currency: string;
  createdAt: string;
  paidAt: string | null;
  studentInfo: StudentInfo | null;
}

interface Statistics {
  totalTransactions: number;
  totalAmount: number;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [stats, setStats] = useState<Statistics>({ totalTransactions: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // GET /annual-access-fee/transactions-all
        const response = await axios.get(`${BASE_URL}/annual-access-fee/transactions-all`, {
           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.data.success) {
            setTransactions(response.data.data);
            setStats(response.data.statistics);
        } else {
            toast.error("Failed to load transactions");
        }
      } catch (error) {
        console.error("Fetch transactions error:", error);
        toast.error("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((t) => {
    const studentName = t.studentInfo?.fullName || "Unknown";
    const matricNo = t.studentInfo?.studentId || "N/A";
    const email = t.studentInfo?.email || "";

    const matchesSearch = 
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      matricNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTransactions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTransactions.map((t) => t.id));
    }
  };

  const handleBulkDownload = () => {
      toast.success(`Downloading ${selectedIds.length} receipts...`);
      // Future: Implement actual bulk download API
      setSelectedIds([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-100 text-green-700 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "failed": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  // Helper to generate avatar from name
  const getAvatarUrl = (name: string) => {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-[1400px] mx-auto py-10 px-8 relative">
        <header className="mb-10 flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Transactions History
            </h1>
            <p className="text-gray-500 mt-2">
              View and monitor all payment transactions in your department.
            </p>
          </div>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <ArrowUpRight size={24} />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Total Transactions</p>
                    <h3 className="text-2xl font-bold text-slate-900">
                        {loading ? "..." : stats.totalTransactions}
                    </h3>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <Download size={24} />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Total Amount</p>
                    <h3 className="text-2xl font-bold text-slate-900">
                        {loading ? "..." : formatCurrency(stats.totalAmount)}
                    </h3>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                    <Calendar size={24} />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">This Month</p>
                    {/* Placeholder for monthly stat if API doesn't provide it yet, or derive from stats if available */}
                    <h3 className="text-2xl font-bold text-slate-900">--</h3> 
                </div>
            </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-80">
                    <input 
                        type="text" 
                        placeholder="Search by student, matric or ref..." 
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
                
                <select 
                    className="px-4 py-2.5 border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm text-sm font-medium text-slate-700 cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="success">Success</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                </select>
            </div>

            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm">
                <Download size={18} />
                Export CSV
            </button>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-20 max-w-[calc(100vw-270px)]">
            <div className="overflow-x-auto">
                <table className="w-full text-left ">
                    <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                        <tr>
                            <th className="px-6 py-4 w-12 text-center">
                                <input
                                type="checkbox"
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer"
                                checked={selectedIds.length === filteredTransactions.length && filteredTransactions.length > 0}
                                onChange={toggleSelectAll}
                                />
                            </th>
                            <th className="px-6 py-4">Transaction Ref</th>
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Payment For</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                        {loading ? (
                             <tr>
                                <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                                    Loading transactions...
                                </td>
                            </tr>
                        ) : filteredTransactions.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                                    No transactions found matching your filters.
                                </td>
                            </tr>
                        ) : (
                            filteredTransactions.map((t) => (
                                <tr 
                                    key={t.id} 
                                    className={`hover:bg-slate-50/50 transition-colors group cursor-pointer ${
                                        selectedIds.includes(t.id) ? "bg-blue-50/30" : ""
                                    }`}
                                    onClick={() => toggleSelection(t.id)}
                                >
                                    <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                                        <input
                                        type="checkbox"
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer"
                                        checked={selectedIds.includes(t.id)}
                                        onChange={() => toggleSelection(t.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                        {t.reference}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={getAvatarUrl(t.studentInfo?.fullName || "Unkown")} 
                                                alt={t.studentInfo?.fullName || "Student"} 
                                                className="w-8 h-8 rounded-full bg-slate-100" 
                                            />
                                            <div>
                                                <p className="font-bold text-slate-700">{t.studentInfo?.fullName || "Unknown Student"}</p>
                                                <p className="text-xs text-slate-500">{t.studentInfo?.studentId || "N/A"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {t.studentInfo?.email || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">
                                        {t.paymentType.replace(/_/g, " ").toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900">
                                        {formatCurrency(t.amount)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {new Date(t.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(t.status)}`}>
                                            {t.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-[#1D7AD9] text-xs font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                                            View Receipt
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination Footer (Mock) */}
            <div className="px-6 py-4 border-t border-slate-50 flex justify-between items-center text-sm text-slate-500">
                <span>Showing {filteredTransactions.length} results</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
                </div>
            </div>
        </div>
        
        {/* Floating Action Bar */}
        {selectedIds.length > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-xl shadow-2xl border border-gray-100 flex items-center gap-6 z-50 animate-in slide-in-from-bottom duration-300">
            <span className="text-sm font-bold text-slate-700">
              {selectedIds.length} items selected
            </span>
            <div className="h-6 w-px bg-slate-200"></div>
            <button 
                onClick={handleBulkDownload}
                className="flex items-center gap-2 bg-[#1D7AD9] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              Bulk Download Receipts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
