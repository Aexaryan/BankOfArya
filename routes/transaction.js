const express = require('express');
const { ensureAuthenticated } = require('../extns/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction'); // Ensure the Transaction model is imported
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Transfer route
router.post("/", ensureAuthenticated, async (req, res) => {
  const { cardNumber, amount } = req.body;

  try {
    // Validate amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      req.flash("error_msg", "Invalid transfer amount.");
      return res.redirect("/user/dashboard");
    }

    // Find recipient by card number
    const recipient = await User.findOne({ cardNumber });
    if (!recipient) {
      req.flash("error_msg", "Recipient not found.");
      return res.redirect("/user/dashboard");
    }

    // Check for sufficient balance
    if (req.user.balance < parsedAmount) {
      req.flash("error_msg", "Insufficient balance.");
      return res.redirect("/user/dashboard");
    }

    // Perform the transfer
    req.user.balance -= parsedAmount;
    recipient.balance += parsedAmount;

    await req.user.save();
    await recipient.save();

    // Create a new transaction record
    const transaction = new Transaction({
      transactionId: uuidv4(), // Auto-generate a unique transaction ID
      sender: req.user.cardNumber, // Assuming `req.user.cardNumber` exists
      recipient: cardNumber, // Provided recipient card number
      amount: parsedAmount, // Transaction amount
      date: new Date(), // Add the transaction timestamp
    });

    await transaction.save(); // Save the transaction

    // Successful transfer
    req.flash("success_msg", "Transfer successful.");
    res.redirect("/user/dashboard");
  } catch (error) {
    console.error("Error during transfer:", error);
    req.flash("error_msg", "An error occurred while processing the transfer.");
    res.redirect("/user/dashboard");
  }
});

module.exports = router;
