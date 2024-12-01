// routes/deleteUser.js
const express = require('express');
const { ensureAuthenticated } = require('../extns/auth');
const { ensureAdmin } = require('../middleware/roles'); // Ensure only admins can delete
const User = require('../models/User');
const router = express.Router();

// Delete user route
router.delete('/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).send('User not found');
    }
    req.flash('success_msg', 'User deleted successfully');
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error deleting user:', error);
    req.flash('error_msg', 'Error occurred while deleting user');
    res.status(500).redirect('/admin/dashboard');
  }
});

module.exports = router;
