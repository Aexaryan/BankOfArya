const express = require('express');
const passport = require('passport');
const router = express.Router();
const flash = require('connect-flash');
// Load Passport configuration
require('../config/passport')(passport);


// Register page route
router.get('/', (req, res) => {
  res.render('register');
});

module.exports = router;
