// routes/deleteUser.js
const express = require('express');
const { ensureAuthenticated } = require('../extns/auth');
const User = require('../models/User');
const router = express.Router();

// Delete user route
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).send('Unauthorized');
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Error occurred while deleting user');
  }
});

module.exports = router;
