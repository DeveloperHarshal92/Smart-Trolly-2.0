// features/auth/pages/AuthLayout.jsx
// This is the layout route that sits above all protected pages.
// It fires fetchCurrentUser once on mount, shows a spinner while hydrating,
// then either renders children or redirects to /login.
// This is the correct pattern for RouterProvider — useNavigate works here
// because AuthLayout renders *inside* the router tree.

import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "../state/auth.slice";

const AuthLayout = () => {
  const dispatch = useDispatch();
  const { user, hydrating } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // Cookie check still in-flight — block rendering
  if (hydrating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <span className="text-xs text-slate-400 font-medium tracking-widest uppercase">
            Loading…
          </span>
        </div>
      </div>
    );
  }

  // Hydration done — not authenticated, go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated — render the protected page
  return <Outlet />;
};

export default AuthLayout;
