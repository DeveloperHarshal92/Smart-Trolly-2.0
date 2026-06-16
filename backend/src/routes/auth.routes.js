import { Router } from "express";
import { register, login, logout, googleCallback, getMe } from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator,
  logoutValidator,
} from "../validator/auth.validator.js";
import passport from "passport";
import { config } from "../config/config.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", registerValidator, register);

/**
 * @route POST /api/auth/login
 * @desc Login user and return token
 * @access Public
 */
router.post("/login", loginValidator, login);

/**
 * @route POST /api/auth/logout
 * @desc Logout user and clear auth cookie
 * @access Public
 */
router.post("/logout", logoutValidator, logout);


/**
 * @route GET /api/auth/me
 * @desc Get current logged in user info
 * @access Protected
 */
router.get("/me", protect, getMe);

/**
 * @route GET /api/auth/google
 * @desc Initiate Google OAuth login
 * @access Public
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

/**
 * @route GET /api/auth/google/callback
 * @desc Handle Google OAuth callback
 * @access Public
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect:
      config.NODE_ENV === "development"
        ? "http://localhost:5173/login"
        : "/login",
  }),
  googleCallback,
);

export default router;
