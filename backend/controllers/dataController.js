const axios = require("axios");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Network = require("../models/Network");
const DataType = require("../models/DataType");
const DataPlan = require("../models/DataPlan");

const gladtidingsBaseUrl = process.env.GLADTIDINGS_BASE_URL;

// Fetch all networks
exports.getNetworks = async (req, res) => {
  try {
    const networks = await Network.find();
    res.json(networks); // Returns an array of networks
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch networks" });
  }
};

// Fetch data types by network
exports.getDataTypesByNetwork = async (req, res) => {
  const { networkId } = req.params;

  try {
    // Assuming DataType has networkId as a reference to the network
    const dataTypes = await DataType.find({ networkId: networkId });
    res.json(dataTypes); // Returns all data types for the given network
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data types" });
  }
};

// Fetch data plans by data type
exports.getPlansByDataType = async (req, res) => {
  console.log("calledd");
  const { networkId, dataType } = req.query;

  if (!networkId || !dataType) {
    return res
      .status(400)
      .json({ error: "Network ID and Data Type are required" });
  }

  try {
    const dataPlans = await DataPlan.find({ networkId, dataType });
    res.status(200).json(dataPlans);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data plans" });
  }
};

// Data purchase
exports.purchaseData = async (req, res) => {
  const { phone, planId, networkId } = req.body;
  const userId = req.user.id;
  try {
    // Step 1: Validate inputs
    if (!userId || !phone || !planId || !networkId) {
      console.log("Validation failed: Missing required fields.");
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Fetch data plan details
    const dataPlan = await DataPlan.findById(planId);
    if (!dataPlan) {
      console.log("Data plan not found.");
      return res
        .status(404)
        .json({ success: false, message: "Data plan not found" });
    }

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found.");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log("@#$%^&*(&^%$^%#$%^&*(&^%udataPlan: ", dataPlan);

    // Check user's balance
    console.log("Checking user's wallet balance...");
    if (user.wallet.balance < dataPlan.amount) {
      console.log("Insufficient wallet balance.");
      return res
        .status(400)
        .json({ success: false, message: "Insufficient wallet balance" });
    }

    // Generate a unique transaction reference
    const transactionReference = `data_${Date.now()}`;

    // Step 2: Make API call to Gladtidings for data purchase
    console.log("Making API call to Gladtidings for data purchase...");

    const data = JSON.stringify({
      network: networkId,
      mobile_number: phone,
      plan: dataPlan.plan_id,
      Ported_number: true,
      ident: transactionReference,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${gladtidingsBaseUrl}/api/data/`,
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
      type: "Data",
      amount: dataPlan.amount,
      status: Status,
      description: `Data purchase for ${dataPlan.name}`,
      reference: transactionReference,
    });
    await transaction.save();
    console.log("Transaction record created:", transaction);

    // Step 4: Update user's wallet balance (if successful)
    if (Status === "successful") {
      console.log("Updating user's wallet balance...");
      user.wallet.balance -= dataPlan.amount;
      await user.save();
      console.log("User's wallet balance updated:", user.wallet.balance);
    }

    // Step 5: Respond to the client
    console.log("Sending response to the client...");
    return res.status(200).json({
      success: Status === "successful",
      message: message || "Data purchase successful",
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
