const express = require("express");
const {
  handleSquadWebhook,
  // handleGladtidingsWebhook,
} = require("../controllers/webhooksController");

const router = express.Router();

router.post("/squad-webhook", handleSquadWebhook); // Squad webhook handler
// router.post("/gladtidings-webhook", handleGladtidingsWebhook); // Squad webhook handler

module.exports = router;
