import { useState, FormEvent, useEffect } from "react";
import { X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { subOrganizationService } from "../api/AdminApi";

export const CreateFacultyModal = ({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (record: any) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
  });

  /* ------------------ auto clear notifications ------------------ */
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 5000);
    return () => clearTimeout(timer);
  }, [notification]);

  /* ------------------ submit handler ------------------ */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNotification(null);

    if (!formData.name.trim() || !formData.code.trim()) {
      setNotification({
        type: "error",
        message: "All fields are required.",
      });
      return;
    }

    setLoading(true);

    const payload = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      type: "FACULTY" as "FACULTY"
    };

    try {
      const res = await subOrganizationService.createFaculty(payload);

      const created = res.data?.data || res.data;

      setNotification({
        type: "success",
        message: `Faculty created successfully`,
      });

      setTimeout(() => {
        onSave({
          id: created.code || formData.code.trim(),
          name: created.name || formData.name.trim(),
          dean: "N/A", // This will be updated when an admin is assigned
          status: "Active",
        });
        onClose();
      }, 1200);
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.response?.data?.message || `Failed to create Faculty`,
      });
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ render ------------------ */
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative animate-in zoom-in duration-200">
        {notification && (
          <div
            className={`absolute top-0 inset-x-0 z-50 p-4 flex items-center gap-3 ${
              notification.type === "success" ? "bg-emerald-500" : "bg-red-500"
            } text-white`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p className="text-sm font-bold">{notification.message}</p>
            <button onClick={() => setNotification(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="px-10 pt-10 pb-4 flex items-center justify-between">
          <h3 className="text-[#1b75d0] font-bold text-xl">
            Add Faculty
          </h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-500 hover:text-slate-700 transition" />
          </button>
        </div>

        <div className="px-10 pb-10 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">
                Faculty Name *
              </label>
              <input
                className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. Faculty of Science"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">
                Faculty Code *
              </label>
              <input
                className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. FOS"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#1b75d0] text-white rounded-xl flex items-center gap-2 hover:bg-blue-600 transition"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Create Faculty"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
