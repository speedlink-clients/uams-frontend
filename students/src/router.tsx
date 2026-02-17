import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Registration from "./pages/Registration";
import Timetable from "./pages/Timetable";
import Payments from "./pages/Payments";
import PaymentsNew from "./pages/PaymentsNew";
import Login from "./pages/Login";
import MainLayout from "./components/MainLayout";
import SessionGuard from "./components/SessionGuard";
import IdCardPaymentCallback from "./pages/IdCardPaymentCallback";

import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import PaymentVerificationPage from "./pages/PaymentVerification";

const router = createBrowserRouter([
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/login",
    element: <Login initialStep="login" />,
  },
  {
    path: "/register",
    element: <Login initialStep="reg-number" />,
  },
  {
    path: "/activate-account",
    element: <Login initialStep="activate" />,
  },
  {
    path: "/payment",
    element: <Login initialStep="payment" />,
  },
  {
    path: "/payment-verification",
    element: <PaymentVerificationPage />,
  },
  {
    path: "/forgot-password",
    element: <Login initialStep="forgot-password" />,
  },
  {
    path: "/idcard-payment-callback",
    element: <IdCardPaymentCallback />,
  },

  // Protected dashboard routes
  {
    path: "/",
    element: <SessionGuard />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "courses",
            element: <Navigate to="/courses/results" replace />,
          },
          {
            path: "courses/*",
            element: <Courses />,
          },
          {
            path: "registration",
            element: <Navigate to="/registration/courses" replace />,
          },
          {
            path: "registration/*",
            element: <Registration />,
          },
          {
            path: "timetable",
            element: <Timetable />,
          },
          {
            path: "payments",
            element: <Payments />,
          },
          {
            path: "payments/new",
            element: <PaymentsNew />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "settings",
            element: <Navigate to="/profile" replace />,
          },
        ],
      },
    ],
  },

  // Catch all - redirect to dashboard
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
], {
  basename: "/students"
});

export default router;
