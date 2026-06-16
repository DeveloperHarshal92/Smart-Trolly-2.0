// features/auth/hooks/useAuth.js
// Removed fetchCurrentUser from here — AuthLayout owns that now.
// This hook is purely for actions (login/register/logout) + reading state.

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  loginUser,
  registerUser,
  logoutUser,
  clearError,
} from "../state/auth.slice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, hydrating, error } = useSelector((state) => state.auth);

  const handleRegister = async (userData) => {
    const result = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(result)) {
      toast.success("Registered successfully!");
      navigate("/");
    } else {
      toast.error(result.payload);
    }
  };

  const handleLogin = async (credentials) => {
    const result = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(result)) {
      toast.success("Logged in successfully!");
      navigate("/");
    } else {
      toast.error(result.payload);
    }
  };

  const handleLogout = async () => {
    const result = await dispatch(logoutUser());
    if (logoutUser.fulfilled.match(result)) {
      toast.success("Logged out successfully!");
      navigate("/login");
    } else {
      toast.error(result.payload);
    }
  };

  return {
    user,
    loading,
    hydrating,
    error,
    handleRegister,
    handleLogin,
    handleLogout,
    clearError: () => dispatch(clearError()),
  };
};