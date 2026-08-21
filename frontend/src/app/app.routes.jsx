// app/app.routes.jsx
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import AuthLayout from "../features/auth/pages/AuthLayout";
import CameraView from "../features/shop/pages/CameraView";
import LandingPage from "../features/shop/pages/LandingPage";
import NotFoundPage from "../features/common/pages/NotFoundPage";

export const routes = createBrowserRouter([
  // ── Public Marketing & Auth routes (Zone A) ────────────────────────────────
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // ── Protected Live Detection routes (Zone B) ──────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/scan",
        element: <CameraView />,
      },
      {
        path: "/dashboard",
        element: <Navigate to="/scan" replace />,
      },
    ],
  },

  // ── 404 Fallback ───────────────────────────────────────────────────────────
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);