import React, { useState, useEffect } from "react";
import axios from "axios";
import { Download } from "lucide-react";
import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface PaymentsSummaryViewProps {
  onViewAllRevenue: (programTypeId: string, programTypeName: string) => void;
}

interface ProgramTypeSummary {
  id: string;
  name: string;
  code: string;
  totalAmount: string;
  totalPayments: number;
  accessFee: { total: string; count: number; amount: number; average: string | number };
  idCardFee: { total: string; count: number; amount: number; average: string | number };
  transcriptFee: { total: string; count: number; amount: number; average: string | number };
  otherPayments: { total: string; count: number; amount: number };
}

interface ProgramRevenue {
  programTypeId: string;
  programType: string;
  accessFee: number;
  idCardFee: number;
  transcriptFee: number;
}

export const PaymentsSummaryView: React.FC<PaymentsSummaryViewProps> = ({ onViewAllRevenue }) => {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<ProgramRevenue[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${BASE_URL}/university-admin/payments`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.data.success) {
          const programTypes: Record<string, ProgramTypeSummary> = response.data.data.summary.programTypes;

          const rows: ProgramRevenue[] = Object.values(programTypes).map((pt) => ({
            programTypeId: pt.id,
            programType: pt.name,
            accessFee: pt.accessFee.amount,
            idCardFee: pt.idCardFee.amount,
            transcriptFee: pt.transcriptFee.amount,
          }));

          setRevenueData(rows);
        } else {
          toast.error("Failed to load payment data");
        }
      } catch (error) {
        console.error("Failed to load summary data:", error);
        toast.error("Failed to load revenue summary");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return "₦" + new Intl.NumberFormat("en-NG").format(amount);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-[1400px] mx-auto py-2 px-2">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Payments History</h1>
          <button className="flex items-center gap-2 bg-[#1D7AD9] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
            <Download size={18} />
            Export
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider w-16">S/N</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Program Types</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Access Fee</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">ID Card Fee</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Transcript Fee</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-400">
                    <div className="flex justify-center items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400"></div>
                      Loading revenue data...
                    </div>
                  </td>
                </tr>
              ) : revenueData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-400">No program types found</td>
                </tr>
              ) : (
                revenueData.map((row, index) => (
                  <tr key={row.programTypeId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 text-slate-500 font-medium">{index + 1}</td>
                    <td className="px-8 py-6 font-bold text-slate-700">{row.programType}</td>
                    <td className="px-8 py-6 font-bold text-slate-500">{formatCurrency(row.accessFee)}</td>
                    <td className="px-8 py-6 font-bold text-slate-500">{formatCurrency(row.idCardFee)}</td>
                    <td className="px-8 py-6 font-bold text-slate-500">{formatCurrency(row.transcriptFee)}</td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => onViewAllRevenue(row.programTypeId, row.programType)}
                        className="text-[#1D7AD9] font-bold text-xs hover:underline"
                      >
                        View all<br />revenue
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
