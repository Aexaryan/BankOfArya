
const express = require('express');
const { ensureAuthenticated } = require('../extns/auth');
const User = require('../models/User');
const router = express.Router();
const Transaction = require('../models/Transaction');

/// User dashboard route
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const transactions = await Transaction.find({ $or: [
      { sender: req.user.cardNumber },
      { recipient: req.user.cardNumber }
    ]});
    res.render('userDashboard', {
      title: 'User Dashboard',
      user: req.user,
      cardNumber: req.user.cardNumber,
      balance: req.user.balance,
      transactions
    });
  } catch (error) {
    console.error('Error rendering user dashboard:', error);
    res.status(500).send('Error occurred while loading the dashboard');
  }
});

// Transfer route
router.post('/transfer', ensureAuthenticated, async (req, res) => {
  const { recipient, amount } = req.body;
  try {
    // Find the recipient by name or card number
    const recipientUser = await User.findOne({ $or: [{ name: recipient }, { cardNumber: recipient }] });
    if (!recipientUser) {
      return res.render('userDashboard', { user: req.user, error: 'Recipient not found', cardNumber: req.user.cardNumber, balance: req.user.balance });
    }

    // Ensure the user has enough balance
    if (req.user.balance < amount) {
      return res.render('userDashboard', { user: req.user, error: 'Insufficient balance', cardNumber: req.user.cardNumber, balance: req.user.balance });
    }

    // Perform the transfer
    req.user.balance -= parseFloat(amount);
    recipientUser.balance += parseFloat(amount);
    await req.user.save();
    await recipientUser.save();

    // Save transaction record
    const transaction = new Transaction({
      sender: req.user.cardNumber,
      recipient: recipientUser.cardNumber,
      amount: parseFloat(amount),
      date: new Date()
    });
    await transaction.save();

    res.render('userDashboard', { user: req.user, success: 'Transfer successful', cardNumber: req.user.cardNumber, balance: req.user.balance });
  } catch (error) {
    console.error('Error during transfer:', error);
    res.render('userDashboard', { user: req.user, error: 'An error occurred during the transfer', cardNumber: req.user.cardNumber, balance: req.user.balance });
  }
});

// Search transactions by recipient name or date
router.get('/transactions', ensureAuthenticated, async (req, res) => {
  const { recipientName, date } = req.query;
  try {
    const query = { $or: [ { sender: req.user.cardNumber }, { recipient: req.user.cardNumber } ] };
    if (recipientName) {
      const recipient = await User.findOne({ name: recipientName });
      if (recipient) {
        query.recipient = recipient.cardNumber;
      }
    }
    if (date) {
      query.date = { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000) };
    }
    const transactions = await Transaction.find(query);
    res.render('transactions', { transactions });
  } catch (error) {
    console.error('Error searching transactions:', error);
    res.status(500).send('Error occurred while searching transactions');
  }
});

// Get transaction by ID
router.get('/transactions/:id', ensureAuthenticated, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).send('Transaction not found');
    }
    res.render('transaction', { transaction });
  } catch (error) {
    console.error('Error getting transaction:', error);
    res.status(500).send('Error occurred while getting transaction');
  }
});

// Delete transaction by ID
router.delete('/transactions/:id', ensureAuthenticated, async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).send('Transaction not found');
    }
    res.send('Transaction deleted successfully');
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).send('Error occurred while deleting transaction');
  }
});

module.exports = router;


