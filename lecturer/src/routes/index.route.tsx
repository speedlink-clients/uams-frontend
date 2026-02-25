import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import AuthRoutes from "./auth.route";

const DashboardLayout = lazy(() => import("@pages/layouts/DashboardLayout"));
const Dashboard = lazy(() => import("@pages/dashboard/Dashboard"));
const Students = lazy(() => import("@pages/students/Students"));
const Lecturers = lazy(() => import("@pages/lecturers/Lecturers"));
const Courses = lazy(() => import("@pages/courses/Courses"));
const CourseDetail = lazy(() => import("@pages/courses/CourseDetail"));
const CourseStudentDetail = lazy(() => import("@pages/courses/CourseStudentDetail"));
const Results = lazy(() => import("@pages/results/Results"));
const ResultDetail = lazy(() => import("@pages/results/ResultDetail"));
const Projects = lazy(() => import("@pages/projects/Projects"));
const Announcement = lazy(() => import("@pages/announcement/Announcement"));
const Payments = lazy(() => import("@pages/payments/Payments"));
const PlaceholderPage = lazy(() => import("@pages/PlaceholderPage"));

const Router = () => {
    return (
        <BrowserRouter basename="/lecturer">
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    {/* Auth Routes — no sidebar/navbar */}
                    {AuthRoutes}

                    {/* Dashboard Routes — with sidebar/navbar */}
                    <Route element={<DashboardLayout />}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/students" element={<Students />} />
                        <Route path="/lecturers" element={<Lecturers />} />
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/courses/:courseId" element={<CourseDetail />} />
                        <Route path="/courses/:courseId/students/:studentId" element={<CourseStudentDetail />} />
                        <Route path="/results" element={<Results />} />
                        <Route path="/results/:courseId" element={<ResultDetail />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/timetable" element={<PlaceholderPage title="Timetable" />} />
                        <Route path="/payments" element={<Payments />} />
                        <Route path="/announcement" element={<Announcement />} />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default Router;
