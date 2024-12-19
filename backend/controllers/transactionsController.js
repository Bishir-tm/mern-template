const Transaction = require("../models/Transaction");

// Controller to get transactions by user ID
exports.getTransactionsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    if (!transactions.length) {
      console.log(transactions);

      return res
        .status(404)
        .json({ message: "No transactions found for this user." });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res
      .status(500)
      .json({ message: "An error occurred while fetching transactions." });
  }
};

exports.getAllUserTransactions = async (req, res) => {
  try {
    const { id } = req.user;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const transactions = await Transaction.find({ id: id });
    if (!transactions) {
      return res.status(404).json({
        success: false,
        message: "No transactions found.",
      });
    }

    res.status(201).json({ transactions: transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while getting wallet data.",
    });
  }
};
