import LoginPage from "@app/auth/login/page";
import RootLayout from "@app/layout";
import type { RouteObject } from "react-router"


const authRoutes: RouteObject[] = [
    {
        element: <RootLayout />,
        children: [
            { path: "/auth/login", element: <LoginPage /> },
            // { path: "/auth/reset-password", element: <ResetPasswordPage /> },
            // { path: "/auth/forgot-password", element: <ForgotPasswordPage /> },
        ]
    }
]

export default authRoutes