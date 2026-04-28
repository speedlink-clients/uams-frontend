import RootLayout from "@app/layouts/layout";
import { lazy } from "react"

const SignupPage = lazy(() => import("@pages/auth/signup/page"));
const LoginPage = lazy(() => import("@pages/auth/login/page"))

const AuthRoutes = [
    {
        element: <RootLayout />,
        children: [
            { path: "/auth/login", element: <LoginPage /> },
            { path: "/auth/signup", element: <SignupPage /> },
            { path: "/auth/forgot-password", element: <p>Forgot Password</p> },
        ],
    }
];

export default AuthRoutes;