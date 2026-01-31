import React, { useState, useEffect } from "react";
import { Edit2, X, Save, RotateCcw } from "lucide-react";
import api from "@/api/axios";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";

interface PaymentSettings {
  currency: string;
  paymentEmail: string;
  paystackPkLive: string;
  paystackPkTest: string;
  paymentAccountName: string;
  paymentAccountBank: string;
  paymentAccountNumber: string;
  paystackPaymentMode: string;
}

const INITIAL_SETTINGS: PaymentSettings = {
  currency: "",
  paymentEmail: "",
  paystackPkLive: "",
  paystackPkTest: "",
  paymentAccountName: "",
  paymentAccountBank: "",
  paymentAccountNumber: "",
  paystackPaymentMode: "",
};

export const ConfigsTab: React.FC = () => {
  const [settings, setSettings] = useState<PaymentSettings>(INITIAL_SETTINGS);
  const [originalSettings, setOriginalSettings] = useState<PaymentSettings>(INITIAL_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/department-admins/payment-settings");
      if (data) {
        const mapped: PaymentSettings = {
          currency: data.currency || "",
          paymentEmail: data.paymentEmail || data.payment_email || "",
          paystackPkLive: data.paystackPkLive || data.paystack_pk_live || "",
          paystackPkTest: data.paystackPkTest || data.paystack_pk_test || "",
          paymentAccountName: data.paymentAccountName || data.payment_account_name || "",
          paymentAccountBank: data.paymentAccountBank || data.payment_account_bank || "",
          paymentAccountNumber: data.paymentAccountNumber || data.payment_account_number || "",
          paystackPaymentMode: data.paystackPaymentMode || data.paystack_payment_mode || (data.is_live_mode ? "live" : "test"),
        };
        setSettings(mapped);
        setOriginalSettings(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch payment settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: keyof PaymentSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setSettings(originalSettings);
    setIsEditing(false);
    toast("Changes discarded", { icon: "↩️" });
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      handleReset();
    } else {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.put("/department-admins/payment-settings", {
        currency: settings.currency,
        payment_email: settings.paymentEmail,
        paystack_pk_live: settings.paystackPkLive,
        paystack_pk_test: settings.paystackPkTest,
        payment_account_name: settings.paymentAccountName,
        payment_account_bank: settings.paymentAccountBank,
        payment_account_number: settings.paymentAccountNumber,
        paystack_payment_mode: settings.paystackPaymentMode,
      });
      toast.success("Payment settings saved successfully");
      setOriginalSettings(settings);
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const FIELDS: { label: string; key: keyof PaymentSettings; type?: string }[] = [
    { label: "Currency", key: "currency" },
    { label: "Payment Email", key: "paymentEmail" },
    { label: "Paystack Pk Live", key: "paystackPkLive" },
    { label: "Paystack Pk Test", key: "paystackPkTest" },
    { label: "Payment Account Name", key: "paymentAccountName" },
    { label: "Payment Account Bank", key: "paymentAccountBank" },
    { label: "Payment Account Number", key: "paymentAccountNumber" },
    { label: "Paystack Payment Mode", key: "paystackPaymentMode" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Payment Settings</h2>
        <button
          onClick={handleToggleEdit}
          disabled={isSaving || loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors border
          ${isEditing
            ? "border-red-200 text-red-600 hover:bg-red-50 bg-white"
            : "border-slate-300 text-slate-600 hover:bg-slate-50 bg-white"
          }`}
        >
          {isEditing ? <X size={16} /> : <Edit2 size={16} />}
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Fields Grid */}
      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
          {FIELDS.map((field) => (
            <div key={field.key}>
              {isEditing ? (
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-blue-600 uppercase tracking-wider text-[11px]">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={settings[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-[#1D75D3] outline-none transition-all"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider text-[11px]">
                    {field.label}
                  </span>
                  <p className="text-slate-800 font-medium text-base break-all">
                    {settings[field.key] || "-"}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex items-center justify-end gap-3 mt-10 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
          <button
            onClick={handleReset}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <RotateCcw size={16} /> Reset
          </button>
          <Button onClick={handleSave} variant="primary" disabled={isSaving} className="px-8">
            {isSaving ? "Saving..." : <span className="flex items-center gap-2"><Save size={16} /> Save Changes</span>}
          </Button>
        </div>
      )}
    </div>
  );
};
