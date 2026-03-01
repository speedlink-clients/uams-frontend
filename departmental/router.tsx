import { createBrowserRouter, Navigate } from "react-router";
import Login from "./components/Login";
import SessionGuard from "./components/SessionGuard";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ProgramCoursesPage from "./pages/ProgramCoursesPage";
import { StudentsView } from "./pages/StudentsView";
import { StaffView } from "./components/StaffView";
import { AnnouncementsView } from "./components/AnnouncementsView";
import PaymentsPage from "./pages/PaymentsPage";
import { SettingsView } from "./components/SettingsView";
import { NotificationsView } from "./components/NotificationsView";
import { RolesView } from "./components/RolesView";
import { ProfileView } from "./components/ProfileView";
import { TimetableView } from "./components/TimetableView";
import TimeTable from "./pages/timetable/page";

const router = createBrowserRouter([
  // Public Routes
  {
    path: "/login",
    element: <Login />,
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
            element: <Dashboard />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "program-courses/*",
            element: <ProgramCoursesPage />,
          },
          {
            path: "students",
            element: <StudentsView />,
          },
          {
            path: "staff",
            element: <StaffView />,
          },
          {
            path: "payments",
            element: <PaymentsPage />,
          },
          {
            path: "id-card",
            element: <RolesView />,
          },
          {
            path: "timetable",
            element: <TimeTable />,
          },
          {
            path: "announcements",
            element: <AnnouncementsView />,
          },
          {
            path: "settings",
            element: <SettingsView />,
          },
          {
            path: "notifications",
            element: <NotificationsView />,
          },
          {
            path: "profile",
            element: <ProfileView />,
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
