import { lazy } from "react";
import { Route } from "react-router";

const Login = lazy(() => import("@pages/auth/Login"));
const ForgotPasswordFlow = lazy(() => import("@pages/auth/ForgotPasswordFlow"));

const AuthRoutes = [
    <Route key="login" path="/login" element={<Login />} />,
    <Route key="forgot-password" path="/forgot-password" element={<ForgotPasswordFlow onBackToLogin={() => { }} />} />]

export default AuthRoutes;
