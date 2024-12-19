// controllers/dashboardController.js
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming authenticated user's ID is available.

    // Fetch User Profile
    const user = await User.findById(userId, "name email");

    // Fetch Wallet Balance
    const wallet = await Wallet.findOne({ userId });
    const balance = wallet ? wallet.balance : 0;

    // Fetch Recent Transactions
    const transactions = await Transaction.find({ userId })
      .sort({ date: -1 })
      .limit(5);

    res.json({
      profile: {
        name: user.name,
        email: user.email,
      },
      balance: {
        amount: balance,
      },
      transactions,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};
