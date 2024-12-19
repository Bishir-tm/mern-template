const axios = require("axios");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

exports.getWalletBalance = async (req, res) => {
  try {
    const { id } = req.user;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(201).json({ balance: user.wallet.balance });
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
exports.addFunds = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    // Validate inputs
    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID or amount.",
      });
    }

    // Verify the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Step 1: Initiate payment using Squad API
    const transactionRef = `wallet_topup_${Date.now()}`;
    const squadResponse = await axios.post(
      `${process.env.SQUAD_BASE_URL}/transaction/initiate`,
      {
        email: user.email, // Assuming `email` is a field in the User model
        amount: amount * 100, // Convert amount to kobo (1 NGN = 100 kobo)
        currency: "NGN",
        initiate_type: "inline",
        transaction_ref: transactionRef,
        callback_url: `${process.env.FRONTEND_BASE_URL}/app/wallet`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SQUAD_SECRET_KEY}`,
        },
      }
    );

    const checkoutUrl = squadResponse.data?.data?.checkout_url;

    if (!checkoutUrl) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate payment link.",
      });
    }

    // Step 2: Save transaction as Pending
    const transaction = await Transaction.create({
      userId,
      type: "Topup",
      amount,
      status: "Pending",
      description: "Wallet top-up initiated",
      reference: transactionRef,
    });

    // Step 3: Respond to frontend with payment link
    res.status(201).json({
      success: true,
      message: "Payment initiated successfully",
      paymentLink: checkoutUrl,
      transactionId: transaction._id,
    });
  } catch (error) {
    console.error(
      "Error in topUpWallet: ",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while processing your request.",
    });
  }
};
