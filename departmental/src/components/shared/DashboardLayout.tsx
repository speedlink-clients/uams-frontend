import { useNavigate, useLocation, Outlet } from "react-router";
import { Sidebar } from "@components/shared/Sidebar";
import { Header } from "@components/shared/Header";
import type { ViewType } from "@type/common.type";
import useAuthStore from "@stores/auth.store";
import { Toaster } from "@components/ui/toaster";
import { Box, Flex } from "@chakra-ui/react";

const DashboardLayout = () => {
    const { email, role, clearAuth } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    // Get user display name
    const currentUser = email
        ? email.split("@")[0]
        : role === "UNIVERSITYADMIN" ? "Admin" : "User";

    const getActiveViewFromPath = (pathname: string): ViewType => {
        const routeMap: Record<string, ViewType> = {
            "/dashboard": "Dashboard",
            "/program-courses": "Programs & Courses",
            "/students": "Students",
            "/staff": "Lecturers",
            "/payments": "Payments",
            "/id-card": "ID Card Management",
            "/announcements": "Announcements",
            "/settings": "Settings",
            "/notifications": "Notifications",
            "/profile": "Profile",
            "/timetable": "Timetable",
        };

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
            "Programs & Courses": "/program-courses",
            Students: "/students",
            Lecturers: "/staff",
            Payments: "/payments",
            "ID Card Management": "/id-card",
            Announcements: "/announcements",
            Settings: "/settings",
            Notifications: "/notifications",
            Profile: "/profile",
            Timetable: "/timetable",
        };
        navigate(routeMap[view] || "/dashboard");
    };

    const handleLogout = () => {
        clearAuth();
        localStorage.removeItem("departmental-auth-store");
        localStorage.removeItem("departmental-user-profile-store");
        sessionStorage.clear();
        window.location.href = "/departmental-admin/login";
    };

    return (
        <Flex minH="100vh">
            <Sidebar
                activeView={activeView}
                onViewChange={handleViewChange}
                onLogout={handleLogout}
            />
            <Box as="main" flex="1" ml="64" bg="#F8FAFC">
                <Toaster />
                <Header
                    onViewChange={handleViewChange}
                    currentUser={currentUser}
                    email={email}
                />
                <Box p="8" maxW="1600px" mx="auto">
                    <Outlet />
                </Box>
            </Box>
        </Flex>
    );
};

export default DashboardLayout;
