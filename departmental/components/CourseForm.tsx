import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { academicsApi, Level, Semester } from "../api/accademicapi";
import { programsCoursesApi } from "../api/programscourseapi";
import { ProgramTypeResponse } from "../api/types";

interface CourseFormProps {
  initialData?: any; // Add initialData prop
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [programTypes, setProgramTypes] = useState<ProgramTypeResponse[]>([]);

  console.log(levels);
  

  // ✅ State keys now match the logic in handleSubmit
  const [formData, setFormData] = useState({
    code: initialData?.code || "",
    title: initialData?.title || "",
    levelId: initialData?.levelId || "",
    semesterId: initialData?.semesterId || "",
    programTypeId: initialData?.programTypeId || "",
    creditUnits: initialData?.creditUnits || 3,
  });

  // Calculate if selected type is Bachelors/Undergraduate
  const selectedProgramType = programTypes.find(
    (t) => t.id === formData.programTypeId
  );
  
  // Broader check for Undergraduate programs
  const isUndergraduate = selectedProgramType?.type === "UNDERGRADUATE" || 
                          selectedProgramType?.name === "Bachelor of Science" ||
                          selectedProgramType?.name.includes("B.Sc");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** FETCH LEVELS */
  useEffect(() => {
    academicsApi.getLevels().then((levels) => setLevels(levels)).catch(console.error);
  }, []);

  /** FETCH SEMESTERS */
  useEffect(() => {
    academicsApi.getSemesters().then(setSemesters).catch(console.error);
  }, []);

  /** FETCH PROGRAM TYPES */
  useEffect(() => {
    const fetchProgramTypes = async () => {
      try {
        const types = await programsCoursesApi.getProgramTypes();
        setProgramTypes(types);
      } catch (err) {
        console.error("Failed to fetch program types:", err);
      }
    };
    fetchProgramTypes();
  }, []);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      // Validation logic based on type
      if (isUndergraduate) {
        if (!formData.levelId || !formData.semesterId) {
          throw new Error("Please select level and semester");
        }
      }

      const level = levels.find((l) => l.id === formData.levelId);
      const semester = semesters.find((s) => s.id === formData.semesterId);

      // Only checking detailed existence if we are in Bachelors mode
      if (isUndergraduate && (!level || !semester)) {
        throw new Error("Invalid level or semester selection");
      }

      const payload = {
        levelId: isUndergraduate ? formData.levelId : undefined,
        semesterId: isUndergraduate ? formData.semesterId : undefined,
        code: formData.code.trim(),
        title: formData.title.trim(),
        creditUnits: Number(formData.creditUnits),
        Level: isUndergraduate && level ? level.name.replace(" Level", "") : undefined,
        Semester: isUndergraduate && semester ? semester.name : undefined,
        programTypeId: formData.programTypeId,
      };

      console.log("Sending course payload:", payload);
      await onSubmit(payload);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to create course";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-8">
      <h2 className="text-xl font-semibold mb-6">
        {initialData ? "Edit Course" : "Create Course"}
      </h2>

      {/* ERROR MESSAGE DISPLAY */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Program Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Program Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.programTypeId}
            onChange={(e) => handleChange("programTypeId", e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Program Type</option>
            {programTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. COS101"
              value={formData.code}
              onChange={(e) => handleChange("code", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Course Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Introduction to Computing"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Level - Only show if Undergraduate */}
          {isUndergraduate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.levelId}
                onChange={(e) => handleChange("levelId", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Level</option>
                {levels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Semester - Only show if Undergraduate */}
          {isUndergraduate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.semesterId}
                onChange={(e) => handleChange("semesterId", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Semester</option>
                {semesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Credit Units */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Credit Units <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.creditUnits}
              onChange={(e) =>
                handleChange("creditUnits", Number(e.target.value))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {[1, 2, 3, 4, 5, 6].map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 transition-colors"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? (initialData ? "Updating..." : "Creating...") : (initialData ? "Update Course" : "Create Course")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
