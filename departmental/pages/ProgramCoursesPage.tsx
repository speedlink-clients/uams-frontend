import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router";
import TabButton from "../components/TabButton";
import ProgramsTab from "../components/ProgramsTab";
import CoursesTab from "../components/CoursesTab";
import StructureTab from "../components/StructureTab";
import ProgramTypeTab from "../components/ProgramTypeTab";
import { BookOpen, Layers, Calendar } from "lucide-react";

const ProgramCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = (pathname: string) => {
    if (pathname.includes("/sessions") || pathname.includes("/structure")) return "Structure";
    if (pathname.includes("/program-types")) return "Program Types";
    if (pathname.includes("/programs")) return "Programs";
    if (pathname.includes("/courses")) return "Courses";
    return "Program Types";
  };

  const activeTab = getActiveTab(location.pathname);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Program & Courses</h2>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <TabButton
            active={activeTab === "Program Types"}
            onClick={() => navigate("/program-courses/program-types")}
            icon={<Layers size={16} />}
            label="Program Types"
          />
          <TabButton
            active={activeTab === "Structure"}
            onClick={() => navigate("/program-courses")}
            icon={<Calendar size={16} />}
            label="Setup & Sessions"
          />
          <TabButton
            active={activeTab === "Programs"}
            onClick={() => navigate("/program-courses/programs")}
            icon={<Layers size={16} />}
            label="Programs"
          />
          <TabButton
            active={activeTab === "Courses"}
            onClick={() => navigate("/program-courses/courses")}
            icon={<BookOpen size={16} />}
            label="Course Catalog"
          />
        </div>
      </div>

      <Routes>
        <Route index element={<ProgramTypeTab />} />
        <Route path="program-types" element={<ProgramTypeTab />} />
        <Route path="programs" element={<ProgramsTab />} />
        <Route path="courses" element={<CoursesTab />} />

        {/* Creation and Edit routes will be handled within tabs or here */}
        <Route path="sessions/new" element={<StructureTab isCreatingRoute={true} />} />
        <Route path="sessions/edit/:id" element={<StructureTab isEditingRoute={true} />} />

        <Route path="programs/new" element={<ProgramsTab isCreatingRoute={true} />} />
        <Route path="programs/edit/:id" element={<ProgramsTab isEditingRoute={true} />} />

        <Route path="courses/new" element={<CoursesTab isCreatingRoute={true} />} />
        <Route path="courses/edit/:id" element={<CoursesTab isEditingRoute={true} />} />
      </Routes>
    </div>
  );
};

export default ProgramCoursesPage;
