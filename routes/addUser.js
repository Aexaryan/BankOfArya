// routes/addUser.js
const express = require('express');
const { ensureAuthenticated } = require('../extns/auth');
const User = require('../models/User');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { ensureAdmin } = require('../middleware/roles');
const bcrypt = require('bcrypt');

// Add new user route
router.post('/', ensureAuthenticated, ensureAdmin, async (req, res) => {
  const { name, email, password, balance, isAdmin } = req.body;

  if (!name || !email || !password) {
    req.flash('error_msg', 'All fields are required');
    return res.redirect('/admin/addUser');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      balance,
      isAdmin: isAdmin === 'on',
      cardNumber: uuidv4(), // Use uuid for card numbers
    });

    await newUser.save();
    req.flash('success_msg', 'User added successfully');
    res.redirect('/admin/dashboard');
  } catch (error) {
    if (error.code === 11000) {
      req.flash('error_msg', 'Email or username already exists.');
      return res.redirect('/admin/addUser'); // Redirect to form instead of send()
    }
    console.error('Error adding user:', error);
    req.flash('error_msg', 'Error occurred while adding user');
    res.redirect('/admin/addUser'); // Handle generic errors
  }
});

module.exports = router;
