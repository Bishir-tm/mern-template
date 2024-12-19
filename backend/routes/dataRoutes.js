const express = require("express");
const router = express.Router();
const {
  getNetworks,
  getDataTypesByNetwork,
  getPlansByDataType,
  purchaseData,
} = require("../controllers/dataController");
const authMiddleware = require("../middleware/authMiddleware");

// Routes
router.get("/networks", getNetworks); // Fetch all networks
router.get("/types/:networkId", getDataTypesByNetwork); // Fetch data types by network
router.get("/plans", getPlansByDataType); // Fetch data plans by data type
router.post("/purchase", authMiddleware, purchaseData);

module.exports = router;
