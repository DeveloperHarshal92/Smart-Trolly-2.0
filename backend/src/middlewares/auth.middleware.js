// middlewares/auth.middleware.js
// Verifies the JWT cookie and attaches req.user = { id }
// Any protected route (including /me) runs this first.

import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const protect = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "Not authenticated",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Session expired. Please log in again.",
      success: false,
    });
  }
};