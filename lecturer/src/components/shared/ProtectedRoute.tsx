import { Navigate, Outlet } from "react-router";
import useAuthStore from "@stores/auth.store";

const ProtectedRoute = () => {
    const { token } = useAuthStore();

    // If no token, redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If token exists, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
