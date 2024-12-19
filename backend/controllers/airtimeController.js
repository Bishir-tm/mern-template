const axios = require("axios");
const AirtimeType = require("../models/AirtimeType");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

const gladtidingsBaseUrl = process.env.GLADTIDINGS_BASE_URL;

// Get airtime types by network
const getTypesByNetwork = async (req, res) => {
  const { networkId } = req.params;
  try {
    const airtimeType = await AirtimeType.findOne({
      network: networkId,
    }).populate("network");
    if (!airtimeType) {
      return res
        .status(404)
        .json({ message: "Airtime types not found for this network" });
    }
    res.status(200).json(airtimeType.types);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Handle airtime purchase (unchanged)
purchaseAirtime = async (req, res) => {
  console.log("in purchaseAirtime :", req.body);

  const { phone, amount, type, networkId } = req.body;
  const userId = req.user.id;

  console.log("body:  ", req.body);
  console.log("userId:  ", req.user.id);

  try {
    // Step 1: Validate inputs
    if (!userId || !phone || !amount || !type || !networkId) {
      console.log("Validation failed: Missing required fields.");
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found.");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check user's balance
    console.log("Checking user's wallet balance...");
    if (user.wallet.balance < amount) {
      console.log("Insufficient wallet balance.");
      return res
        .status(400)
        .json({ success: false, message: "Insufficient wallet balance" });
    }

    // Generate a unique transaction reference
    const transactionReference = `airtime_${Date.now()}`;

    // Step 2: Make API call to Gladtidings for airtime purchase
    console.log("Making API call to Gladtidings for airtime purchase...");

    const data = JSON.stringify({
      network: networkId,
      mobile_number: phone,
      amount: Number(amount),
      Ported_number: true,
      airtime_type: type,
      ident: transactionReference,
    });
    console.log("data to be sent: >> ", data);

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${gladtidingsBaseUrl}/api/topup/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.GLADTIDINGS_API_KEY}`,
      },
      data,
    };

    const response = await axios(config);

    console.log("Received response from Gladtidings API:", response.data);

    const { Status, transaction_id, message } = response.data;

    // Step 3: Create a transaction record
    console.log("Creating transaction record...");
    const transaction = new Transaction({
      userId,
      type: "Airtime",
      amount: amount,
      status: Status,
      description: `Airtime purchase for ${phone}`,
      reference: transactionReference,
    });
    await transaction.save();
    console.log("Transaction record created:", transaction);

    // Step 4: Update user's wallet balance (if successful)
    if (Status === "successful") {
      console.log("Updating user's wallet balance...");
      user.wallet.balance -= amount;
      await user.save();
      console.log("User's wallet balance updated:", user.wallet.balance);
    }

    // Step 5: Respond to the client
    console.log("Sending response to the client...");
    return res.status(200).json({
      success: Status === "successful",
      message: message || "Airtime purchase successful",
      transactionId: transaction_id,
    });
  } catch (error) {
    console.error("Detailed error:", error.response?.data || error.stack);
    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.error || "An error occurred. Please try again.",
    });
  }
};

module.exports = { getTypesByNetwork, purchaseAirtime };
