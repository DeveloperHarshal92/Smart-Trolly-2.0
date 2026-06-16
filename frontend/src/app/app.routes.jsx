// app/app.routes.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import AuthLayout from "../features/auth/pages/AuthLayout";

// Placeholder — replace with real Shop page when built
const ShopPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <h1 className="text-slate-700 font-semibold">Shop — coming soon</h1>
  </div>
);

export const routes = createBrowserRouter([
  // ── Public routes ──────────────────────────────────────────────────────────
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // ── Protected routes (wrapped by AuthLayout) ───────────────────────────────
  // AuthLayout fires fetchCurrentUser, shows spinner, redirects to /login if
  // unauthenticated. All shop/dashboard pages go inside here as children.
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <ShopPage />,
      },
      // Add more protected routes here as the project grows:
      // { path: "/checkout", element: <CheckoutPage /> },
      // { path: "/bill",     element: <BillPage /> },
    ],
  },

  // ── Fallback ───────────────────────────────────────────────────────────────
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);