const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User'); // Ensure correct path
const router = express.Router();

router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  let { balance, isAdmin } = req.body;

  try {
    // Validate balance
    if (!balance || isNaN(parseFloat(balance)) || parseFloat(balance) < 0) {
      return res.status(400).json({ error: 'Balance must be a valid non-negative number.' });
    }
    balance = parseFloat(balance);

    // Handle checkbox for admin
    isAdmin = isAdmin === 'on'; // Converts 'on' (checkbox value) to true

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, balance, isAdmin },
      { new: true, runValidators: true } // Return updated user and validate input
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.redirect('/admin/dashboard');
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error.', details: error.errors });
    }
    console.error('Error updating user:', error);
    res.status(500).json({ error: `Failed to update user: ${error.message}` });
  }
});

module.exports = router;
