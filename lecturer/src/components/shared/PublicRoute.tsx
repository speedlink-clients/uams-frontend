import { Navigate, Outlet } from "react-router";
import useAuthStore from "@stores/auth.store";

const PublicRoute = () => {
    const { token } = useAuthStore();

    // If user is already logged in, redirect them away from auth pages (login/forgot-password) to dashboard
    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    // If not logged in, allow access to public auth pages
    return <Outlet />;
};

export default PublicRoute;
