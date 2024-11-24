

const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const transferFunds = async (req, res) => {
  try {
    const { cardNumber, amount } = req.body;

    // Validate required fields
    if (!cardNumber || !amount) {
      return res.status(400).json({ message: "Card number and amount are required" });
    }

    // Parse the amount to a number
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: "Invalid transfer amount" });
    }

    // Find the recipient by card number
    const recipient = await User.findOne({ cardNumber });
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Ensure sender has sufficient balance
    if (req.user.balance < parsedAmount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Perform the transfer
    req.user.balance -= parsedAmount;
    recipient.balance += parsedAmount;

    // Save the updates for both users
    await req.user.save();
    await recipient.save();

    // Create a transaction record
    const transaction = new Transaction({
      transactionId: uuidv4(),
      sender: req.user.cardNumber,
      recipient: cardNumber,
      amount: parsedAmount,
      date: new Date(),
    });

    // Save the transaction
    await transaction.save();

    // Respond with success
    res.status(200).json({
      message: "Transfer successful",
      transaction: {
        id: transaction.transactionId,
        sender: transaction.sender,
        recipient: transaction.recipient,
        amount: transaction.amount,
        date: transaction.date,
      },
    });
  } catch (error) {
    console.error("Error during transfer:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  transferFunds,
};
