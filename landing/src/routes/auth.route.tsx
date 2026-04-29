import RootLayout from "@app/layouts/layout";
import { lazy } from "react"

const LoginPage = lazy(() => import("@pages/auth/login/page"))

const AuthRoutes = [
    {
        element: <RootLayout />,
        children: [
            { path: "/auth/login", element: <LoginPage /> },
            { path: "/auth/forgot-password", element: <p>Forgot Password</p> },
        ],
    }
];

export default AuthRoutes;