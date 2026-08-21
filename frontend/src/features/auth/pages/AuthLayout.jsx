// features/auth/pages/AuthLayout.jsx
// Sits above protected pages, checks user session, and renders LoadingPage while hydrating.

import React, { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "../state/auth.slice";
import LoadingPage from "../../common/pages/LoadingPage";

const AuthLayout = () => {
  const dispatch = useDispatch();
  const { user, hydrating } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // Cookie check still in-flight — show sleek LoadingPage
  if (hydrating) {
    return <LoadingPage message="Verifying authentication session..." />;
  }

  // Hydration complete — unauthenticated users go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated — render protected route
  return <Outlet />;
};

export default AuthLayout;
