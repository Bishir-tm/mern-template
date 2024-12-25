const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const adminMiddleware = require("../middleware/adminMiddleware");

// Admin User management
router.get("/users/", adminMiddleware, getAllUsers);
router.get("/users/:id", adminMiddleware, getUserById);
router.post("/users/", adminMiddleware, createUser);
router.put("/users/:id", adminMiddleware, updateUser);
router.delete("/users/:id", adminMiddleware, deleteUser);

module.exports = router;
