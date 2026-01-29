
import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

interface AddStaffFormProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any; // For edit mode if needed
}

export const AddStaffForm: React.FC<AddStaffFormProps> = ({
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    staffId: "",
    title: "",
    firstName: "",
    otherName: "",
    sex: "",
    highestDegree: "",
    phoneNumber: "",
    email: "",
    password: "",
    role: "",
    category: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        staffId: initialData.staffId || "",
        title: initialData.title || "",
        firstName: initialData.firstname || initialData.firstName || initialData.name?.split(" ")[0] || "",
        otherName: initialData.othername || initialData.otherName || initialData.name?.split(" ").slice(1).join(" ") || "",
        sex: initialData.sex || "",
        highestDegree: initialData.highestDegree || initialData.level || "",
        phoneNumber: initialData.phoneNumber || initialData.phone || "",
        email: initialData.email || "",
        password: initialData.password || "", // Password usually not sent back, keep empty or handle separately
        role: initialData.role || "",
        category: initialData.category || "", 
      });
    } else {
        // Leave empty for new entry
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Map to API payload structure
    const payload = {
      staffId: formData.staffId,
      title: formData.title,
      firstname: formData.firstName,
      othername: formData.otherName,
      sex: formData.sex.toUpperCase(),
      highestDegree: formData.highestDegree,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      role: formData.role,
      category: formData.category,
      // Only send password if it's set (for edit) or if it's new (default)
      // Actually backend might require it for create. For update it might be optional. 
      // We'll send it if available.
      ...(formData.password ? { password: formData.password } : ( !initialData ? { password: formData.phoneNumber } : {} )), 
    };

    try {
      await onSubmit(payload);
    } catch (error: any) {
      console.error(error);
      // If parent doesn't handle toast, we could here, but parent likely handles logic errors.
      // We can add a generic fallback or just rely on parent throwing only if it wants us to stay in loading/error state?
      // Actually usually parent handles success toast. We can handle error toast here if parent throws.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[#1D7AD9]">
              {initialData ? "Edit Lecturer" : "Add Lecturer"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Staff ID */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Staff ID
                </label>
                <input
                  type="text"
                  value={formData.staffId}
                  onChange={(e) =>
                    setFormData({ ...formData, staffId: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 focus:outline-none"
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="E.g Dr, Mr etc"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* First Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

               {/* Other Name */}
               <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Other Name
                </label>
                <input
                  type="text"
                  value={formData.otherName}
                  onChange={(e) =>
                    setFormData({ ...formData, otherName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              {/* Sex */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Sex
                </label>
                <input
                  type="text"
                  placeholder="Male" // Should ideally be a select
                  value={formData.sex}
                  onChange={(e) =>
                    setFormData({ ...formData, sex: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Highest Degree */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Highest Degree
                </label>
                <input
                  type="text"
                  placeholder="PhD"
                  value={formData.highestDegree}
                  onChange={(e) =>
                    setFormData({ ...formData, highestDegree: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Enter Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  placeholder="COMPUTING" // from screenshot, strictly likely computing@example.com
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                  <input
                    type="password"
                    placeholder="Use Phone Number as Default Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none transition-all cursor-pointer text-slate-700"
                  />
              </div>

              {/* Role */}
               <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Role
                </label>
                <input
                  type="text"
                  placeholder="ERO"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="Professor"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-2.5 text-sm font-bold text-white bg-[#1D7AD9] rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                {initialData ? "Save Changes" : "Add Staff"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
