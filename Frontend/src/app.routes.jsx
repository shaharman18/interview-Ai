import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

// Loading component
const PageLoader = () => (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
    </div>
);

const Login = lazy(() => import("./features/auth/pages/Login"));
const Register = lazy(() => import("./features/auth/pages/Register"));
const ForgotPassword = lazy(() => import("./features/auth/pages/ForgotPassword"));
const Protected = lazy(() => import("./features/auth/component/Protected"));
const Home = lazy(() => import("./features/ai/pages/Home"));
const InterviewPage = lazy(() => import("./features/ai/pages/InterviewPage"));
const HistoryPage = lazy(() => import("./features/ai/pages/HistoryPage"));
const Settings = lazy(() => import("./features/ai/pages/Settings"));

const withSuspense = (Component) => (
    <Suspense fallback={<PageLoader />}>
        {Component}
    </Suspense>
);
export const router = createBrowserRouter([
    {   
        path: "/login",
        element: withSuspense(<Login />)
    },
    {   
        path: "/register",
        element: withSuspense(<Register />)
    },
    {   
        path: "/forgot-password",
        element: withSuspense(<ForgotPassword />)
    },
    {
        path: "/",
        element: withSuspense(<Protected><Home /></Protected>)
    },
    {
        path: "/interview/:interviewId",
        element: withSuspense(<Protected><InterviewPage /></Protected>)
    },
    {
        path: "/history",
        element: withSuspense(<Protected><HistoryPage /></Protected>)
    },
    {
        path: "/settings",
        element: withSuspense(<Protected><Settings /></Protected>)
    }
]);

