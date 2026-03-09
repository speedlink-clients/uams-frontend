import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import AuthRoutes from "@routes/auth.route";
import ProtectedRoute from "@components/shared/ProtectedRoute";
import PublicRoute from "@components/shared/PublicRoute";
import TimeTable from "@pages/timetable/page";

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

const router = createBrowserRouter([
    {
        element: <PublicRoute />,
        children: AuthRoutes,
    },
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    { index: true, element: <Navigate to="/dashboard" replace /> },
                    { path: "dashboard", element: <Dashboard /> },
                    { path: "students", element: <Students /> },
                    { path: "lecturers", element: <Lecturers /> },
                    { path: "courses", element: <Courses /> },
                    { path: "courses/:courseId", element: <CourseDetail /> },
                    { path: "courses/:courseId/students/:studentId", element: <CourseStudentDetail /> },
                    { path: "results", element: <Results /> },
                    { path: "results/:courseId", element: <ResultDetail /> },
                    { path: "projects", element: <Projects /> },
                    { path: "timetable", element: <TimeTable /> },
                    { path: "announcement", element: <Announcement /> },
                ],
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/dashboard" replace />,
    },
], {
    basename: "/lecturer",
});

export default router;
