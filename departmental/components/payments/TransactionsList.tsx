import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Search, Download, Upload, X, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

type PaymentTab = "Access Fee" | "ID Card" | "Transcript";

interface TransactionsListProps {
  onBack: () => void;
  programTypeId?: string | null;
  programTypeName?: string;
}

interface TransactionItem {
  transactionReference: string;
  transactionId: string;
  paymentFrom: string;
  studentName: string;
  studentRegNumber: string;
  paymentFor: string;
  paymentType: string;
  amount: string;
  currency: string;
  date: string;
  status: string;
  sessionId: string;
  sessionName: string;
  statusBadge: string;
}

interface ProgramPayments {
  programInfo: { id: string; name: string; code: string };
  accessFee: TransactionItem[];
  idCardFee: TransactionItem[];
  transcriptFee: TransactionItem[];
  otherPayments: TransactionItem[];
}

interface ProgramTypeSummary {
  id: string;
  name: string;
  code: string;
  accessFee: { amount: number };
  idCardFee: { amount: number };
  transcriptFee: { amount: number };
}

export default function TransactionsList({ onBack, programTypeId, programTypeName }: TransactionsListProps) {
  const [activeTab, setActiveTab] = useState<PaymentTab>("Access Fee");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sessionFilter, setSessionFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [programPayments, setProgramPayments] = useState<ProgramPayments | null>(null);
  const [programSummary, setProgramSummary] = useState<ProgramTypeSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const tabs: PaymentTab[] = ["Access Fee", "ID Card", "Transcript"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/university-admin/payments`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.data.success) {
          const data = response.data.data;

          // Find the matching program type in paymentsByProgramType
          const match = data.paymentsByProgramType?.find(
            (p: ProgramPayments) => p.programInfo.id === programTypeId
          );
          if (match) setProgramPayments(match);

          // Find the matching summary
          const summaries: Record<string, ProgramTypeSummary> = data.summary?.programTypes || {};
          const summaryMatch = Object.values(summaries).find((s) => s.id === programTypeId);
          if (summaryMatch) setProgramSummary(summaryMatch);
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
    fetchData();
  }, [programTypeId]);

  // Get transactions for the active tab
  const tabTransactions: TransactionItem[] = useMemo(() => {
    if (!programPayments) return [];
    switch (activeTab) {
      case "Access Fee": return programPayments.accessFee || [];
      case "ID Card": return programPayments.idCardFee || [];
      case "Transcript": return programPayments.transcriptFee || [];
      default: return [];
    }
  }, [programPayments, activeTab]);

  // Get the total amount for the active tab from summary
  const tabTotal = useMemo(() => {
    if (!programSummary) return 0;
    switch (activeTab) {
      case "Access Fee": return programSummary.accessFee.amount;
      case "ID Card": return programSummary.idCardFee.amount;
      case "Transcript": return programSummary.transcriptFee.amount;
      default: return 0;
    }
  }, [programSummary, activeTab]);

  // Apply search, status, date filters
  const filteredTransactions = useMemo(() => {
    return tabTransactions.filter((t) => {
      const matchesSearch =
        !searchQuery ||
        t.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.paymentFrom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.transactionReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.studentRegNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || t.status === statusFilter;

      let matchesDate = true;
      if (dateFrom) {
        matchesDate = matchesDate && new Date(t.date) >= new Date(dateFrom);
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && new Date(t.date) <= toDate;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [tabTransactions, searchQuery, statusFilter, dateFrom, dateTo]);

  const handleClearDateFilters = () => {
    setDateFrom("");
    setDateTo("");
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "success": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "failed": return "bg-red-100 text-red-600";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "success": return "Success";
      case "pending": return "Pending";
      case "failed": return "Decline";
      default: return status;
    }
  };

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return "₦" + new Intl.NumberFormat("en-NG").format(num);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const truncateRef = (ref: string) => {
    if (ref.length <= 20) return ref;
    return ref.substring(0, 8) + "…." + ref.substring(ref.length - 4);
  };

  const tabLabel = activeTab === "Access Fee" ? "Access Fee" : activeTab === "ID Card" ? "ID Card" : "Transcript";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-[1400px] mx-auto py-2 px-2">

        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-4 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Payments</span>
        </button>

        {/* Tabs */}
        <div className="flex items-center mb-6">
          <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 text-sm font-semibold transition-colors ${
                  activeTab === tab
                    ? "bg-white text-[#1D7AD9] border-b-2 border-[#1D7AD9]"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Card + Export */}
        <div className="flex items-start justify-between mb-8">
          <div className="bg-gradient-to-r from-[#e8f5e9] to-[#f1f8e9] rounded-xl px-8 py-6 flex items-center gap-4 min-w-[400px]">
            <div className="h-12 w-12 rounded-lg bg-[#4caf50]/20 flex items-center justify-center">
              <Upload size={22} className="text-[#4caf50]" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Total {tabLabel} Payments</p>
              <h2 className="text-3xl font-bold text-slate-900">{formatCurrency(tabTotal)}</h2>
            </div>
          </div>

          <button className="flex items-center gap-2 bg-[#1D7AD9] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
            <Download size={18} />
            Export
          </button>
        </div>

        {/* Transaction History Header + Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h2 className="text-lg font-bold text-slate-900">
            Transaction History <span className="text-slate-400">({filteredTransactions.length})</span>
          </h2>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or transaction ID"
                className="w-64 pl-10 pr-4 py-2 border border-slate-200 rounded-full bg-white outline-none text-sm focus:ring-2 focus:ring-blue-500/10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                className="appearance-none px-4 py-2 pr-8 border border-slate-200 rounded-full bg-white outline-none text-sm font-medium text-slate-600 cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Decline</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>

            {/* Session Filter */}
            <div className="relative">
              <select
                className="appearance-none px-4 py-2 pr-8 border border-slate-200 rounded-full bg-white outline-none text-sm font-medium text-slate-600 cursor-pointer"
                value={sessionFilter}
                onChange={(e) => setSessionFilter(e.target.value)}
              >
                <option value="all">Session</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>

            {/* Date From */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">From</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-full bg-white outline-none text-sm text-slate-600 cursor-pointer"
              />
            </div>

            {/* Date To */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">To</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-full bg-white outline-none text-sm text-slate-600 cursor-pointer"
              />
            </div>

            {/* Clear Dates */}
            {(dateFrom || dateTo) && (
              <button onClick={handleClearDateFilters} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-14">S/N</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Transaction Id</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Payment from</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Payment for</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-slate-400">
                      <div className="flex justify-center items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400"></div>
                        Loading transactions...
                      </div>
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-slate-400">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((t, index) => (
                    <tr key={t.transactionId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-500">{index + 1}</td>
                      <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                        {truncateRef(t.transactionReference)}
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium">
                        {t.studentName}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {t.paymentFor}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {formatCurrency(t.amount)}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(t.date)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold ${getStatusStyle(t.status)}`}>
                          {getStatusLabel(t.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
