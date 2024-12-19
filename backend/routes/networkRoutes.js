const express = require("express");
const router = express.Router();
const { getAllNetworks } = require("../controllers/networkController");

// Route to get all networks
router.get("/", getAllNetworks);

module.exports = router;
