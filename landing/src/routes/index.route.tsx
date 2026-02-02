import { Route, Routes, BrowserRouter } from "react-router";
import AuthRoutes from "./auth.route";
import ProfileRoutes from "./profile.route";
import { lazy } from "react";
import RootLayout from "@app/layouts/layout";
import LandingLayout from "@app/layouts/LandingLayout";

const DashboardPage = lazy(() => import("../app/pages/dashboard/page"));
const LandingPage = lazy(() => import("../app/pages/landing/page"));


const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* public routes */}
                <Route element={<RootLayout />}>
                    <Route element={<LandingLayout />}>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/about" element={<p>About Us</p>} />
                        <Route path="/contact" element={<p>Contact Support</p>} />
                    </Route>
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Route>
            </Routes>



            {/* auth routes */}
            <AuthRoutes />

            {/* protected routes */}
            <ProfileRoutes />
        </BrowserRouter >
    )
}

export default Router;