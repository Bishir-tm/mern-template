const express = require("express");
const router = express.Router();
const {
  getTypesByNetwork,
  purchaseAirtime,
} = require("../controllers/airtimeController");
const authMiddleware = require("../middleware/authMiddleware");

// Route to fetch airtime types by network
router.get("/types/:networkId", getTypesByNetwork);

// Route to handle airtime purchase
router.post("/purchase", authMiddleware, purchaseAirtime);

module.exports = router;
