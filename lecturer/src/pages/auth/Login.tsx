import { useState } from "react";
import LoginFormStep from "./LoginFormStep";
import ForgotPasswordFlow from "./ForgotPasswordFlow";

type AuthView = "login" | "forgot-password";

const Login = () => {
    const [view, setView] = useState<AuthView>("login");

    return (
        <>
            {view === "login" && (
                <LoginFormStep
                    onLoginSuccess={() => {
                        // Navigation is handled inside LoginFormStep
                    }}
                    onForgotPassword={() => setView("forgot-password")}
                />
            )}
            {view === "forgot-password" && (
                <ForgotPasswordFlow
                    onBackToLogin={() => setView("login")}
                />
            )}
        </>
    );
};

export default Login;
