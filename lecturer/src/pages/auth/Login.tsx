import { useNavigate } from "react-router";
import LoginFormStep from "./LoginFormStep";

const Login = () => {
    const navigate = useNavigate();

    return (
        <LoginFormStep
            onLoginSuccess={() => {
                // Navigation is handled inside LoginFormStep
            }}
            onForgotPassword={() => navigate("/forgot-password")}
        />
    );
};

export default Login;
