import userModel from "./../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const sendTokenResponse = (user, res, message) => {
  const token = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("token", token, {
    httpOnly: true, // JS cannot read it — XSS protection
    secure: config.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "strict", // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // Match JWT expiry: 7 days
  });

  res.status(200).json({
    message,
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      contact: user.contact,
      googleId: user.googleId,
    },
  });
};

export const register = async (req, res) => {
  const { username, email, password, contact, googleId } = req.body;
  try {
    if (!password && !googleId) {
      return res.status(400).json({
        message: "Password or Google ID is required",
        success: false,
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already in use",
        success: false,
      });
    }

    const userData = { username, email, contact, googleId };
    if (password) userData.password = password;

    const user = await userModel.create(userData);
    await sendTokenResponse(user, res, "User registered successfully");
  } catch (error) {
    res.status(500).json({
      message: "Internal Server error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }
    const isMatch = await user.verifyPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }
    await sendTokenResponse(user, res, "Login successful");
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res
    .status(200)
    .json({ message: "Logged out successfully", success: true });
};

export const googleCallback = async (req, res) => {
  const { id, displayName, emails } = req.user;
  const email = emails[0].value;
  try {
    let user = await userModel.findOne({ email });
    if (!user) {
      user = await userModel.create({
        email,
        username: displayName,
        googleId: id,
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      config.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token);
    res.redirect("http://localhost:5173/");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    // req.user.id is set by the protect middleware
    const user = await userModel.findById(req.user.id).select("-password");
 
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
 
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        contact: user.contact,
        googleId: user.googleId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
