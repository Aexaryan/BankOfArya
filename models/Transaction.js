const mongoose = require('mongoose');

// Transaction Model (models/Transaction.js)
const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, unique: true, required: true }, // Unique transaction ID
  sender: { type: String, required: true }, // Card number as string
  recipient: { type: String, required: true }, // Card number as string
  amount: { type: Number, required: true }, // Transaction amount
  date: { type: Date, default: Date.now }, // Transaction date
});

// Export the model
module.exports = mongoose.model('Transaction', transactionSchema);
