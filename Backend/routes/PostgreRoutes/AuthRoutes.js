import express from "express";
import bcrypt from "bcrypt";
import pool from "../../db/postgres.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9._-]{3,30}$/;
const roleRegex = /^[a-zA-Z_]{2,30}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[^\s]{8,64}$/;

router.post("/register", async (req, res) => {
  // #swagger.tags = ['Auth']
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        status: "error",
        message: "Username, email, password, and role are required",
      });
    }

    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedRole = role.trim().toLowerCase();

    if (!usernameRegex.test(normalizedUsername)) {
      return res.status(400).json({
        success: false,
        status: "error",
        message: "Username must be 3-30 chars and can contain letters, numbers, dot, underscore, hyphen",
      });
    }

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        status: "error",
        message: "Email id not exist or wrong email entered",
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        status: "error",
        message:
          "Password must be 8-64 chars with uppercase, lowercase, number, and special character",
      });
    }

    if (!roleRegex.test(normalizedRole)) {
      return res.status(400).json({
        success: false,
        status: "error",
        message: "Role format is invalid",
      });
    }

    const allowedRoles = (process.env.ALLOWED_ROLES || "")
      .split(",")
      .map((r) => r.trim().toLowerCase())
      .filter(Boolean);

    if (allowedRoles.length > 0 && !allowedRoles.includes(normalizedRole)) {
      return res.status(400).json({
        success: false,
        status: "error",
        message: `Role is not allowed. Allowed roles: ${allowedRoles.join(", ")}`,
      });
    }

    // Check email exists
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (userCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        status: "error",
        message: "User already exists",
      });
    }

    // Check username exists
    const usernameCheck = await pool.query(
      "SELECT id FROM users WHERE LOWER(username) = LOWER($1)",
      [normalizedUsername]
    );

    if (usernameCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        status: "error",
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id",
      [normalizedUsername, normalizedEmail, hashedPassword, normalizedRole]
    );

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      user_id: result.rows[0].id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      status: "error",
      message: "Server error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        status: "error",
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        status: "error",
        message: "Email id not exist or wrong email entered",
      });
    }

    if (typeof password !== "string" || password.length < 8 || password.length > 64) {
      return res.status(400).json({
        success: false,
        status: "error",
        message: "Password must be between 8 and 64 characters",
      });
    }

    const result = await pool.query(
      "SELECT id, username, email, password, role FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        status: "error",
        message: "Email id not exist or wrong email entered",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        status: "error",
        message: "Incorrect password, please try again",
      });
    }

    // JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      email: user.email,
      username: user.username,
      role: user.role,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message, // debug ke liye better
    });
  }
});

export default router;

