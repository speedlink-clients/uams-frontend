
import React, { useState } from 'react';
import { 
  MessageSquare, 
  Mail, 
  Settings as SettingsIcon, 
  UserSquare, // ID Card
  CreditCard, 
  Globe, 
  GraduationCap, 
  FileText,
  Edit
} from 'lucide-react';
import { IDCardSettingsTab } from './IDCardSettingsTab';
import { PaymentSettingsTab } from './PaymentSettingsTab';
import { ConfigsTab } from './ConfigsTab';

type SettingsTab = 'SMS' | 'Email' | 'Configs' | 'ID Card' | 'Payment' | 'Website' | 'Academic' | 'Documents';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('SMS');

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500">
      
      {/* Tabs Navigation */}
      <div className="bg-slate-50 p-1.5 rounded-lg flex items-center justify-between gap-1 overflow-x-auto mb-8 border border-slate-200">
         <TabButton active={activeTab === 'SMS'} onClick={() => setActiveTab('SMS')} icon={<MessageSquare size={16}/>} label="SMS" />
         <TabButton active={activeTab === 'Email'} onClick={() => setActiveTab('Email')} icon={<Mail size={16}/>} label="Email" />
         <TabButton active={activeTab === 'Configs'} onClick={() => setActiveTab('Configs')} icon={<SettingsIcon size={16}/>} label="Configs" />
         <TabButton active={activeTab === 'ID Card'} onClick={() => setActiveTab('ID Card')} icon={<UserSquare size={16}/>} label="ID Card" />
         <TabButton active={activeTab === 'Payment'} onClick={() => setActiveTab('Payment')} icon={<CreditCard size={16}/>} label="Payment" />
         <TabButton active={activeTab === 'Website'} onClick={() => setActiveTab('Website')} icon={<Globe size={16}/>} label="Website" />
         <TabButton active={activeTab === 'Academic'} onClick={() => setActiveTab('Academic')} icon={<GraduationCap size={16}/>} label="Academic" />
         <TabButton active={activeTab === 'Documents'} onClick={() => setActiveTab('Documents')} icon={<FileText size={16}/>} label="Documents" />
      </div>

      {/* Content Area */}
      {activeTab === 'ID Card' ? (
        <IDCardSettingsTab />
      ) : activeTab === 'Payment' ? (
        <PaymentSettingsTab />
      ) : activeTab === 'Configs' ? (
        <ConfigsTab />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center min-h-[600px] flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
             <div className="bg-slate-50 p-6 rounded-full mb-6">
                <SettingsIcon className="h-12 w-12 text-slate-300" strokeWidth={1.5} />
             </div>
             <h3 className="text-xl font-bold text-slate-800 mb-2">Settings for {activeTab} Coming Soon</h3>
             <p className="text-slate-500 max-w-sm mx-auto">
                We are currently working on the {activeTab} settings module. 
                Please check back later for updates.
             </p>
        </div>
      )}
    </div>
  );
};

const TabButton: React.FC<{ active?: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-bold transition-all whitespace-nowrap
      ${active 
        ? 'bg-white text-[#1D7AD9] shadow-sm border border-slate-200' 
        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
      }`}
  >
    {icon}
    {label}
  </button>
);


