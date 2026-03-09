import { lazy } from "react";
import { useNavigate } from "react-router";
import type { RouteObject } from "react-router";

const Login = lazy(() => import("@pages/auth/Login"));
const ForgotPasswordFlow = lazy(() => import("@pages/auth/ForgotPasswordFlow"));

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    return <ForgotPasswordFlow onBackToLogin={() => navigate("/login")} />;
};

const AuthRoutes: RouteObject[] = [
    {
        path: "login",
        element: <Login />,
    },
    {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
    },
];

export default AuthRoutes;
