import RootLayout from "@app/layouts/layout";
import { lazy } from "react"

const SignupPage = lazy(() => import("@pages/auth/signup/page"));

const AuthRoutes = [
    {
        element: <RootLayout />,
        children: [
            { path: "/auth/login", element: <p>Login</p> },
            { path: "/auth/signup", element: <SignupPage /> },
            { path: "/auth/forgot-password", element: <p>Forgot Password</p> },
        ],
    }
];

export default AuthRoutes;