const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET || "9068149540";

const register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
    }
    // Log the incoming request body to ensure the correct data

    // Check if user already exists with the same email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new user
    const user = await User.create({ fullname, email, password });

    // Log successful user creation

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    // Log error details for debugging
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  console.log("login called");
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user?.role }, JWT_SECRET, {
      expiresIn: "2h",
    });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get current user data
const getCurrentUser = async (req, res) => {
  try {
    // `req.user` is set by the authMiddleware and contains the decoded JWT token
    const userId = req.user.id;

    // Find user by ID
    const user = await User.findById(userId).select("-password"); // Don't include the password field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user data without the password
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, getCurrentUser };
