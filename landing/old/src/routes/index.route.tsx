import { createBrowserRouter } from "react-router";
import AuthRoutes from "./auth.route";
import ProfileRoutes from "./profile.route";
import { lazy } from "react";
import RootLayout from "@app/layouts/layout";
import LandingLayout from "@app/layouts/LandingLayout";

const DashboardPage = lazy(() => import("../app/pages/dashboard/page"));
const LandingPage = lazy(() => import("../app/pages/landing/page"));

const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                element: <LandingLayout />,
                children: [
                    { index: true, element: <LandingPage /> },
                    { path: "/about", element: <p>About Us</p> },
                    { path: "/contact", element: <p>Contact Support</p> },
                ],
            },
            { path: "/dashboard", element: <DashboardPage /> },
        ],
    },
    ...AuthRoutes,
    ...ProfileRoutes,
]);

export default router;