import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recipients, setRecipients] = useState<{ student: boolean; staff: boolean; }>({
    student: false,
    staff: false,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!recipients.student && !recipients.staff) {
      toast.error('Please select at least one recipient');
      return;
    }
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setLoading(true);
    try {
      // Map selections to API values: student → "STUDENT", staff → "OTHERS"
      const isForValues: string[] = [];
      if (recipients.student) isForValues.push('STUDENT');
      if (recipients.staff) isForValues.push('OTHERS');

      // Send one request per recipient type
      await Promise.all(
        isForValues.map(isFor =>
          api.post('/notifications', {
            title,
            body: description,
            isFor,
          })
        )
      );

      toast.success('Announcement created successfully');
      onSuccess();
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
      setRecipients({ student: false, staff: false });
    } catch (error) {
      console.error('Failed to create announcement:', error);
      toast.error('Failed to create announcement');
    } finally {
      setLoading(false);
    }
  };

  const toggleRecipient = (type: 'student' | 'staff') => {
    setRecipients(prev => ({ ...prev, [type]: !prev[type] }));
  };

  // Helper to show selected text
  const getSelectedText = () => {
    const selected = [];
    if (recipients.student) selected.push('Student');
    if (recipients.staff) selected.push('Staff');
    
    if (selected.length === 0) return 'Select Recipient(s)';
    if (selected.length <= 2) return selected.join(', ');
    return `${selected.length} Selected`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-[#1D7AD9]">Create New Announcement</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Announcement Title"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 outline-none focus:ring-2 focus:ring-[#1D7AD9]/20 focus:border-[#1D7AD9] transition-all"
            />
          </div>

          {/* Recipients Dropdown */}
          <div className="space-y-2 relative">
            <label className="text-sm font-bold text-slate-900">
              Recipient(s) <span className="text-red-500">*</span>
            </label>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-left flex items-center justify-between text-slate-700 outline-none focus:ring-2 focus:ring-[#1D7AD9]/20 focus:border-[#1D7AD9] transition-all"
            >
              <span className={!Object.values(recipients).some(Boolean) ? "text-slate-400" : ""}>
                {getSelectedText()}
              </span>
              <svg 
                className={`w-5 h-5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-100">
                <label className="flex items-center px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={recipients.student}
                    onChange={() => toggleRecipient('student')}
                    className="w-5 h-5 rounded border-slate-300 text-[#1D7AD9] focus:ring-[#1D7AD9] cursor-pointer"
                  />
                  <span className="ml-3 text-sm font-medium text-slate-700">Student</span>
                </label>
                <label className="flex items-center px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={recipients.staff}
                    onChange={() => toggleRecipient('staff')}
                    className="w-5 h-5 rounded border-slate-300 text-[#1D7AD9] focus:ring-[#1D7AD9] cursor-pointer"
                  />
                  <span className="ml-3 text-sm font-medium text-slate-700">Staff</span>
                </label>
              </div>
            )}
            {/* Click outside listener could be added here for robustness, 
                but for now clicking the button again or selecting items works */}
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe announcement in details"
              rows={6}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 outline-none focus:ring-2 focus:ring-[#1D7AD9]/20 focus:border-[#1D7AD9] transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-slate-100 border border-slate-100 text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !title || !description || !Object.values(recipients).some(Boolean)}
            className="px-8 py-3 bg-[#1D7AD9] text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Announcement
          </button>
        </div>

      </div>
    </div>
  );
};
