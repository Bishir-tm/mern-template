const express = require("express");
const router = express.Router();

const {
  createNetwork,
  getAllNetworks,
  updateNetwork,
  deleteNetwork,
} = require("../controllers/networkController");

const {
  getAllDataTypes,
  createDataType,
  updateDataType,
  deleteDataType,
} = require("../controllers/dataTypeController");

const {
  createDataPlan,
  getAllDataPlans,
  updateDataPlan,
  deleteDataPlan,
} = require("../controllers/dataPlanController");

const {
  getAllAirtimeTypes,
  createAirtimeType,
  updateAirtimeType,
  deleteAirtimeType,
} = require("../controllers/airtimeTypeController"); // Import Airtime Types Controller

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const {
  getTransactionsByUserId,
} = require("../controllers/transactionsController");

const adminMiddleware = require("../middleware/adminMiddleware");

// Admin Network management
router.get("/networks", adminMiddleware, getAllNetworks);
router.post("/networks", adminMiddleware, createNetwork);
router.put("/networks/:id", adminMiddleware, updateNetwork);
router.delete("/networks/:id", adminMiddleware, deleteNetwork);

// Admin Data types management
router.get("/datatypes", adminMiddleware, getAllDataTypes);
router.post("/datatypes", adminMiddleware, createDataType);
router.put("/datatypes/:id", adminMiddleware, updateDataType);
router.delete("/datatypes/:id", adminMiddleware, deleteDataType);

// Admin Data Plans management
router.get("/dataplans", adminMiddleware, getAllDataPlans);
router.post("/dataplans", adminMiddleware, createDataPlan);
router.put("/dataplans/:id", adminMiddleware, updateDataPlan);
router.delete("/dataplans/:id", adminMiddleware, deleteDataPlan);

// Admin Airtime Types management
router.get("/airtimetypes", adminMiddleware, getAllAirtimeTypes); // Get all Airtime Types
router.post("/airtimetypes", adminMiddleware, createAirtimeType); // Create Airtime Type
router.put("/airtimetypes/:id", adminMiddleware, updateAirtimeType); // Update Airtime Type
router.delete("/airtimetypes/:id", adminMiddleware, deleteAirtimeType); // Delete Airtime Type

// Admin User management
router.get("/users/", adminMiddleware, getAllUsers);
router.get("/users/:id", adminMiddleware, getUserById);
router.post("/users/", adminMiddleware, createUser);
router.put("/users/:id", adminMiddleware, updateUser);
router.delete("/users/:id", adminMiddleware, deleteUser);

router.get("/transactions/:userId", adminMiddleware, getTransactionsByUserId);

module.exports = router;
