import { lazy } from "react";
import { useNavigate, Route } from "react-router";

const Login = lazy(() => import("@pages/auth/Login"));
const ForgotPasswordFlow = lazy(() => import("@pages/auth/ForgotPasswordFlow"));

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    return <ForgotPasswordFlow onBackToLogin={() => navigate("/login")} />;
};

const AuthRoutes = [
    <Route key="login" path="login" element={<Login />} />,
    <Route key="forgot-password" path="forgot-password" element={<ForgotPasswordPage />} />
];

export default AuthRoutes;
