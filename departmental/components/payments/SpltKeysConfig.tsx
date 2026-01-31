"use client";

import React, { useEffect, useState } from "react";
import { Save, Edit2, X, RotateCcw } from "lucide-react";
import api from "@/api/axios";
import { programsCoursesApi } from "@/api/programscourseapi";
import { ProgramTypeResponse } from "@/api/types";
import TabButton from "@/components/TabButton";
import { Button } from "@/components/ui/Button";

/**
 * Frontend field → backend payment_type mapping
 */
const PAYMENT_TYPE_MAP: Record<string, string> = {
  annual_access_fee: "annual_access_fee",
  id_card_payment: "id_card_fee",
  transcript_fee: "transcript_fee",
};

type SplitsState = {
  annual_access_fee: string;
  id_card_payment: string;
  transcript_fee: string;
};

const INITIAL_SPLITS: SplitsState = {
  annual_access_fee: "",
  id_card_payment: "",
  transcript_fee: "",
};

const SplitKeysConfig = () => {
  const [splits, setSplits] = useState<SplitsState>(INITIAL_SPLITS);
  const [originalSplits, setOriginalSplits] = useState<SplitsState>(INITIAL_SPLITS);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Program Types
  const [programTypes, setProgramTypes] = useState<ProgramTypeResponse[]>([]);
  const [selectedProgramTypeId, setSelectedProgramTypeId] = useState<string>("");

  // Fetch program types on mount
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await programsCoursesApi.getProgramTypes();
        setProgramTypes(types);
        if (types.length > 0) {
          setSelectedProgramTypeId(types[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch program types:", err);
      }
    };
    fetchTypes();
  }, []);

  /**
   * 🔹 Fetch existing payment splits and populate inputs
   */
  useEffect(() => {
    if (!selectedProgramTypeId) return;

    const fetchPaymentSplits = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/university-admin/payment-splits?programTypeId=${selectedProgramTypeId}`);

        const populatedSplits: SplitsState = { ...INITIAL_SPLITS };

        if (Array.isArray(data)) {
          data.forEach((item: any) => {
            const frontendKey = Object.keys(PAYMENT_TYPE_MAP).find(
              (key) => PAYMENT_TYPE_MAP[key] === item.payment_type,
            );

            if (frontendKey && item.split_code) {
              populatedSplits[frontendKey as keyof SplitsState] = item.split_code;
            }
          });
        }

        setSplits(populatedSplits);
        setOriginalSplits(populatedSplits);
      } catch (err) {
        console.error("Failed to fetch payment splits:", err);
        setSplits(INITIAL_SPLITS);
        setOriginalSplits(INITIAL_SPLITS);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentSplits();
  }, [selectedProgramTypeId]);

  const handleInputChange = (key: keyof SplitsState, value: string) => {
    setSplits((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setSplits(originalSplits);
    setIsEditing(false);
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      handleReset();
    } else {
      setIsEditing(true);
    }
  };

  /**
   * 🔹 Save split codes
   */
  const handleSave = async () => {
    const filledEntries = Object.entries(splits).filter(
      ([_, value]) => value.trim() !== "",
    );

    if (filledEntries.length === 0) {
      return;
    }

    try {
      setIsSaving(true);

      await Promise.all(
        filledEntries.map(([key, splitCode]) =>
          api.post("/university-admin/payment-splits", {
            payment_type: PAYMENT_TYPE_MAP[key],
            split_code: splitCode,
            programTypeId: selectedProgramTypeId,
          }),
        ),
      );

      setOriginalSplits(splits);
      setIsEditing(false);
    } catch (err: any) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const FIELDS = [
    { label: "Annual Access Fee", key: "annual_access_fee", placeholder: "SPL_xxxxxxxxx" },
    { label: "ID Card Fee", key: "id_card_payment", placeholder: "SPL_xxxxxxxxx" },
    { label: "Transcript Fee", key: "transcript_fee", placeholder: "SPL_xxxxxxxxx" },
  ];

  return (
    <div className="pt-8 border-t border-gray-200">
      {/* Header with Edit Toggle */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-semibold text-gray-900">
          Split Key Settings
        </h2>
        
        {programTypes.length > 0 && (
          <button 
            onClick={handleToggleEdit}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors border
            ${isEditing 
                ? 'border-red-200 text-red-600 hover:bg-red-50 bg-white' 
                : 'border-slate-300 text-slate-600 hover:bg-slate-50 bg-white'}`}
          >
            {isEditing ? <X size={16} /> : <Edit2 size={16} />}
            {isEditing ? "Cancel" : "Edit"}
          </button>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Configure Paystack split keys for departmental payments
      </p>

      {/* PROGRAM TYPE TABS */}
      <section className="mb-8">
        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          Program Levels
        </h3>
        <div className="flex flex-wrap gap-2 bg-slate-50 p-1.5 rounded-xl w-fit">
          {programTypes.map((type) => (
            <TabButton 
              key={type.id} 
              active={selectedProgramTypeId === type.id} 
              onClick={() => setSelectedProgramTypeId(type.id)} 
              icon={null} 
              label={type.name} 
            />
          ))}
        </div>
        {programTypes.length === 0 && !loading && (
          <p className="text-sm text-slate-400 mt-2">No program types found.</p>
        )}
      </section>

      {/* Fields */}
      <div className="max-w-2xl space-y-6">
        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : (
          FIELDS.map((field) => (
            <div key={field.key}>
              {isEditing ? (
                <div className="flex flex-col gap-2 text-left">
                  <label className="text-[15px] font-medium text-gray-700">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={splits[field.key as keyof SplitsState]}
                    onChange={(e) => handleInputChange(field.key as keyof SplitsState, e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-[#1D75D3] outline-none transition-all placeholder:text-gray-300"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider text-[11px]">{field.label}</span>
                  <p className="text-slate-800 font-medium text-lg">
                    {splits[field.key as keyof SplitsState] || '-'}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

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

export default SplitKeysConfig;
