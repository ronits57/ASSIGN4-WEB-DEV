const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const appEvents = require("../events/appEvents");

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email and password are required"
      });
    }

    const cleanUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // Validate username
    if (cleanUsername.length < 2) {
      return res.status(400).json({
        message: "Username must contain at least 2 characters"
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Invalid email address"
      });
    }

    // Validate password
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters"
      });
    }

    // Check existing user
    const exists = await User.findOne({
      email: normalizedEmail
    });

    if (exists) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Always register public users as normal users
    const user = await User.create({
      username: cleanUsername,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user"
    });

    appEvents.emit("userRegistered", user);

    return res.status(201).json({
      message: "User registered successfully",
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    console.error("Signup error:", err.message);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Verify password
    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id.toString(),
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    // Secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000
    });

    appEvents.emit("userLoggedIn", user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login error:", err.message);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


// POST /api/auth/logout
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });

  return res.status(200).json({
    message: "Logged out successfully"
  });
};
