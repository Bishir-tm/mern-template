const User = require("../models/User"); // Import your User model

// Fetch all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

// Fetch a single user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id); // Find user by ID
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { fullname, email, role, wallet } = req.body;
  try {
    const newUser = new User({ fullname, email, role, wallet }); // Create user
    await newUser.save();
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: "Failed to create user" });
  }
};

// Update user details
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullname, email, role, wallet } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { fullname, email, role, wallet },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
