const crypto = require("crypto");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

// Constants
const VALID_EVENT = "charge_successful";
const SUCCESS_STATUS = "Success";
const COMPLETED_STATUS = "Completed";
const FAILED_STATUS = "Failed";

// Squad payment gateway transactions Webhook Handler
exports.handleSquadWebhook = async (req, res) => {
  try {
    const secret = process.env.SQUAD_SECRET_KEY;
    const signature = req.headers["x-squad-encrypted-body"];

    // Step 1: Validate the webhook payload
    const payload = JSON.stringify(req.body);
    console.log("Received webhook payload: ", payload);

    // Generate hash and compare with signature
    const hash = crypto
      .createHmac("sha512", secret)
      .update(payload)
      .digest("hex")
      .toUpperCase();

    if (hash !== signature) {
      console.log("Invalid signature. Webhook cannot be trusted.");
      return res.status(400).json({
        success: false,
        message: "Invalid signature. Webhook cannot be trusted.",
      });
    }

    // Step 2: Extract and validate transaction details
    const { Event, TransactionRef, Body } = req.body;

    if (!Event || !TransactionRef || !Body) {
      console.log("Invalid payload structure.");
      return res.status(400).json({
        success: false,
        message: "Invalid payload structure. Required fields are missing.",
      });
    }

    const { amount, transaction_status, email } = Body;

    if (Event !== VALID_EVENT) {
      console.log("Unhandled event type:", Event);
      return res.status(200).json({
        success: true, // Return 200 to avoid retries for unhandled events
        message: "Unhandled event type. No action taken.",
      });
    }

    // Step 3: Check if the transaction reference already exists
    const existingTransaction = await Transaction.findOne({
      reference: TransactionRef,
    });

    if (!existingTransaction) {
      console.log(
        "Transaction not found in the database. Reference:",
        TransactionRef
      );
      return res.status(404).json({
        success: false,
        message: "Transaction not found in the database.",
      });
    }

    if (existingTransaction.status === COMPLETED_STATUS) {
      console.log("Transaction already processed. Reference:", TransactionRef);
      return res.status(200).json({
        success: true,
        message: "Transaction already processed.",
      });
    }

    // Step 4: Update the transaction and user's wallet
    if (transaction_status === SUCCESS_STATUS) {
      const user = await User.findById(existingTransaction.userId);

      if (!user) {
        console.log("User not found. UserID:", existingTransaction.userId);
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      // Update transaction status
      existingTransaction.status = COMPLETED_STATUS;
      await existingTransaction.save();

      // Update user's wallet balance
      const amountInNGN = amount / 100; // Convert from kobo to NGN
      user.wallet.balance += amountInNGN;
      await user.save();

      console.log(
        "Transaction processed successfully. Reference:",
        TransactionRef
      );
      return res.status(200).json({
        success: true,
        message: "Transaction processed successfully.",
      });
    } else {
      existingTransaction.status = FAILED_STATUS;
      await existingTransaction.save();

      console.log("Transaction failed. Reference:", TransactionRef);
      return res.status(400).json({
        success: false,
        message: "Transaction failed.",
      });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the webhook.",
    });
  }
};

// exports.handleGladtidingsWebhook = async (req, res) => {
//   console.log("Glad tidings webhook called: ", req.body);
//   try {
//     const secret = process.env.GLADTIDINGS_SECRET_KEY;
//     const signature = req.headers["x-gladtidings-signature"];
//     const payload = JSON.stringify(req.body);

//     // Step 1: Validate the signature
//     const hash = crypto
//       .createHmac("sha512", secret)
//       .update(payload)
//       .digest("hex");
//     if (hash !== signature) {
//       console.error("Invalid webhook signature.");
//       return res.status(403).json({ error: "Invalid signature" });
//     }
//     console.log("signature is valid");

//     // Step 2: Extract webhook data
//     const { transaction_ref, status, transaction_type, amount } = req.body;

//     // Step 3: Find the transaction
//     const transaction = await Transaction.findOne({
//       reference: transaction_ref,
//     });
//     if (!transaction) {
//       console.error("Transaction not found. Reference:", transaction_ref);
//       return res.status(404).json({ error: "Transaction not found" });
//     }

//     // Step 4: Update the transaction status
//     transaction.status = status === "success" ? "Completed" : "Failed";
//     await transaction.save();

//     // Step 5: If successful, update the user's wallet balance (if refunded)
//     if (status === "success") {
//       console.log(`Transaction ${transaction_ref} was successful.`);
//     } else {
//       // Handle failures (refund wallet if needed)
//       const user = await User.findById(transaction.userId);
//       if (user) {
//         user.wallet.balance += amount; // Refund the amount
//         await user.save();
//         console.log(`Refunded amount ${amount} to user ${user._id}`);
//       }
//     }

//     return res
//       .status(200)
//       .json({ success: true, message: "Webhook processed successfully" });
//   } catch (error) {
//     console.error("Error processing webhook:", error.message);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };
