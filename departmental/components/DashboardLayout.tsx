import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ViewType } from "../types";
import { useAuth } from "../context/AuthProvider";
import { Toaster } from "react-hot-toast";

const DashboardLayout: React.FC = () => {
  const { authData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!authData) return null;

  // Get user display name
  const currentUser = authData.email
    ? authData.email.split("@")[0]
    : authData.role === "UNIVERSITYADMIN" ? "Admin" : "User";

  const getActiveViewFromPath = (pathname: string): ViewType => {
    const routeMap: Record<string, ViewType> = {
      "/dashboard": "Dashboard",
      "/program-courses": "Program & Courses",
      "/students": "Students",
      "/staff": "Lecturers",
      "/payments": "Payments",
      "/id-card": "ID Card Management",
      "/announcements": "Announcements",
      "/settings": "Settings",
      "/notifications": "Notifications",
    };

    // Check if path starts with one of the keys for nested sub-routes
    for (const [route, view] of Object.entries(routeMap)) {
      if (pathname === route || pathname.startsWith(route + "/")) {
        return view;
      }
    }

    return "Dashboard";
  };

  const activeView = getActiveViewFromPath(location.pathname);

  const handleViewChange = (view: ViewType) => {
    const routeMap: Record<ViewType, string> = {
      Dashboard: "/dashboard",
      "Program & Courses": "/program-courses",
      Students: "/students",
      Lecturers: "/staff",
      Payments: "/payments",
      "ID Card Management": "/id-card",
      Announcements: "/announcements",
      Settings: "/settings",
      Notifications: "/notifications",
      Profile: "/profile",
    };
    navigate(routeMap[view] || "/dashboard");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        onLogout={logout}
      />
      <main className="flex-1 ml-64 bg-[#F8FAFC]">
        <Toaster position="top-right" />
        <Header
          onViewChange={handleViewChange}
          currentUser={currentUser}
          onLogout={logout}
          authData={authData}
        />
        <div className="p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
