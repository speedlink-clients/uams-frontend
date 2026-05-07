import { createBrowserRouter, RouterProvider } from "react-router";
import authRoutes from "./auth.route";
import RootLayout from "@app/layout";
import LandingPage from "@app/page";


const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            { path: "/", element: <LandingPage /> },
        ]
    },
    {
        children: [
            ...authRoutes
        ]
    }
]);

const Router = () => {
    return <RouterProvider router={router} />;
}

export default Router;