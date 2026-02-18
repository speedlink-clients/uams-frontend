import React, { useState, useEffect } from 'react';
import { Plus, Clock, Search, X } from 'lucide-react';
import api from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';
import { CreateAnnouncementModal } from './CreateAnnouncementModal';

interface Announcement {
  id: string;
  title: string;
  content: string; // mapped from API 'body'
  createdAt: string;
  isFor: string;
  isRead: boolean;
}

export const AnnouncementsView: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Date Filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      const data = response.data?.data || [];
      
      const transformed = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        content: item.body,
        createdAt: item.createdAt,
        isFor: item.isFor,
        isRead: item.isRead,
      }));
      
      setAnnouncements(transformed);
    } catch (err) {
      console.error("Failed to fetch announcements", err);
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA'); // YYYY-MM-DD
  };

  // Filter logic
  const filteredAnnouncements = announcements.filter(item => {
    if (!dateFrom && !dateTo) return true;
    
    const itemDate = new Date(item.createdAt).setHours(0,0,0,0);
    const from = dateFrom ? new Date(dateFrom).setHours(0,0,0,0) : null;
    const to = dateTo ? new Date(dateTo).setHours(0,0,0,0) : null;

    if (from && itemDate < from) return false;
    if (to && itemDate > to) return false;
    
    return true;
  });

  const handleClearFilters = () => {
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-20">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Announcement</h2>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-[#1D7AD9] text-white px-5 py-2.5 rounded-lg cursor-pointer flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/10 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={18} /> 
          Create New Announcement
        </button>
      </div>

      {/* Date Filters */}
      <div className="flex justify-end items-center mb-8 gap-3">
        <label className="text-sm font-medium text-slate-700">From</label>
        <div className="bg-[#eff3f6] rounded-xl px-4 py-2.5">
          <input 
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
          />
        </div>

        <label className="text-sm font-medium text-slate-700 ml-2">To</label>
        <div className="bg-[#eff3f6] rounded-xl px-4 py-2.5">
          <input 
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
          />
        </div>
        
        {(dateFrom || dateTo) && (
          <button 
            onClick={handleClearFilters}
            className="bg-[#eff3f6] hover:bg-slate-200 p-2.5 rounded-xl transition-colors text-slate-700 ml-2"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {loading ? (
           <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D7AD9]"></div>
             <p className="text-slate-500 font-medium">Loading Announcements...</p>
           </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">No announcements found</p>
          </div>
        ) : (
          filteredAnnouncements.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative group"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                <span className="text-[10px] font-medium text-slate-400">
                  {formatDate(item.createdAt)}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                {item.content}
              </p>
              
              {/* Optional: Show recipient tags if needed, though not in screenshot */}
              {/* <div className="mt-3 flex gap-2">
                {item.recipients.map(r => (
                  <span key={r} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-full capitalize">
                    {r}
                  </span>
                ))}
              </div> */}
            </div>
          ))
        )}
      </div>

      <CreateAnnouncementModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchAnnouncements}
      />
    </div>
  );
};
