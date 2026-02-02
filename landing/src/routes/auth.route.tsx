import RootLayout from "@app/layouts/layout";
import { lazy } from "react"
import { Routes, Route } from "react-router"

const SignupPage = lazy(() => import("@pages/auth/signup/page"));

const AuthRoutes = () => {
    return (
        <Routes>
            <Route element={<RootLayout />}>
                <Route path="/auth/login" element={<p>Login</p>} />
                <Route path="/auth/signup" element={<SignupPage />} />
                <Route path="/auth/forgot-password" element={<p>Forgot Password</p>} />
            </Route>
        </Routes>
    )
}

export default AuthRoutes