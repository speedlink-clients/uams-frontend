
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, bgColor, description }) => {
  return (
    <div className={`${bgColor} p-6 rounded-2xl flex items-center gap-5 transition-transform hover:scale-[1.02] cursor-default border border-black/5`}>
      <div className="bg-white/40 p-3 rounded-xl shadow-sm text-slate-800">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {description && (
            <p className="text-xs text-slate-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};
