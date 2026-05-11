import { createBrowserRouter, Navigate } from "react-router";
import { lazy } from "react";
import SessionGuard from "@components/shared/AuthGuard";
import DashboardLayout from "@components/shared/DashboardLayout";

// Lazy-loaded pages
const LoginPage = lazy(() => import("@app/auth/login/page"));
const ForgotPasswordPage = lazy(() => import("@components/shared/ForgotPasswordFlow"));
const DashboardPage = lazy(() => import("@app/dashboard/page"));
const ProgramCoursesPage = lazy(() => import("@app/programs/page"));
const StudentsPage = lazy(() => import("@app/students/page"));
const StaffPage = lazy(() => import("@app/lecturers/page"));
const PaymentsPage = lazy(() => import("@app/payments/page"));
const IDCardPage = lazy(() => import("@app/idcard/page"));
const TimetablePage = lazy(() => import("@app/timetable/page"));
const AnnouncementsPage = lazy(() => import("@app/announcements/page"));
const SettingsPage = lazy(() => import("@app/settings/page"));
const NotificationsPage = lazy(() => import("@app/notifications/page"));
const ProfilePage = lazy(() => import("@app/profile/page"));
const AuditLogsPage = lazy(() => import("@app/audit-logs/page"));

const router = createBrowserRouter([
    // Public Routes
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
    },

    // Protected Routes
    {
        path: "/",
        element: <SessionGuard />,
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    {
                        index: true,
                        element: <DashboardPage />,
                    },
                    {
                        path: "dashboard",
                        element: <DashboardPage />,
                    },
                    {
                        path: "program-courses/*",
                        element: <ProgramCoursesPage />,
                    },
                    {
                        path: "students",
                        element: <StudentsPage />,
                    },
                    {
                        path: "staff",
                        element: <StaffPage />,
                    },
                    {
                        path: "payments",
                        element: <PaymentsPage />,
                    },
                    {
                        path: "id-card",
                        element: <IDCardPage />,
                    },
                    {
                        path: "timetable",
                        element: <TimetablePage />,
                    },
                    {
                        path: "announcements",
                        element: <AnnouncementsPage />,
                    },
                    {
                        path: "settings",
                        element: <SettingsPage />,
                    },
                    {
                        path: "notifications",
                        element: <NotificationsPage />,
                    },
                    {
                        path: "profile",
                        element: <ProfilePage />,
                    },
                    {
                        path: "audit-logs",
                        element: <AuditLogsPage />,
                    },
                ],
            },
        ],
    },

    // Catch all
    {
        path: "*",
        element: <Navigate to="/dashboard" replace />,
    },
], {
    basename: "/departmental-admin"
});

export default router;