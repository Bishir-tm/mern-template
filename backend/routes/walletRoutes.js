const express = require("express");
const {
  getWalletBalance,
  addFunds,
  // withdrawFundsFromWallet,
} = require("../controllers/walletController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAllUserTransactions,
} = require("../controllers/transactionsController");

const router = express.Router();

router.post("/balance", authMiddleware, getWalletBalance); // Get wallet balance
router.post("/transactions", authMiddleware, getAllUserTransactions); // Get wallet balance
router.post("/add-funds", addFunds); // Add funds to wallet
// router.post("/transfer", authMiddleware, transferFunds); // Withdraw funds from wallet

module.exports = router;
