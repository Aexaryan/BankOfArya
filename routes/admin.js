const { ensureAuthenticated } = require('../extns/auth');
const { ensureAdmin } = require('../middleware/roles');
const User = require('../models/User');
const express = require('express');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const Transaction = require('../models/Transaction');



const router = express.Router()


// Admin dashboard route
router.get('/dashboard', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 }); // Sort by most recent first
    const users = await User.find();
    res.render('adminDashboard', { title: 'Admin Dashboard', user: req.user, users, transactions });
  } catch (error) {
    console.error('Error loading admin dashboard:', error);
    res.status(500).send('Error occurred while loading the dashboard');
  }
});

// Update user details
router.put('/user/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, balance, isAdmin } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, {
      name,
      email,
      balance,
      isAdmin: isAdmin === 'on',
    }, { new: true, runValidators: true });
    if (!updatedUser) {
      req.flash('error_msg', 'User not found');
      return res.status(404).redirect('/admin/dashboard');
    }
    req.flash('success_msg', 'User updated successfully');
    res.redirect('/admin/dashboard');
  } catch (error) {
    if (error.code === 11000) {
      req.flash('error_msg', 'Email or username already exists.');
      return res.status(400).redirect('/admin/dashboard');
    }
    console.error('Error updating user:', error);
    req.flash('error_msg', 'Error occurred while updating user');
    res.status(500).redirect('/admin/dashboard');
  }
});

// Add new user
router.post('/add-user', async (req, res) => {
  const { name, email, password, balance, isAdmin } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      balance,
      isAdmin: isAdmin === 'on',
      cardNumber: Math.floor(100000000000 + Math.random() * 900000000000),
    });
    await newUser.save();
    res.redirect('/admin/dashboard');
    req.flash('success_msg', 'User added successfully');
  } catch (error) {
    if (error.code === 11000) {
      req.flash('error_msg', 'Email or username already exists.');
      return res.status(400).send('Email or username already exists.');
    }
    console.error('Error adding user:', error);
    req.flash('error_msg', 'Error occurred while adding user');
    res.status(500).send('Error occurred while adding user');
  }
});
// Delete user
router.delete('/user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      req.flash('error_msg', 'User not found');
      return res.status(404).redirect('/admin/dashboard');
    }
    req.flash('success_msg', 'User deleted successfully');
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error deleting user:', error);
    req.flash('error_msg', 'Error occurred while deleting user');
    res.status(500).redirect('/admin/dashboard');
  }
});

module.exports = router; // Export the router for use in other files