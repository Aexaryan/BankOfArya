const express = require('express');
const passport = require('passport');
const router = express.Router();
const flash = require('connect-flash');
// Load Passport configuration
require('../config/passport')(passport);


// Login route
router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/user/dashboard", // Redirect on successful login
    failureRedirect: "/login", // Redirect on failure
    failureFlash: true, // Enable flash messages for errors
  })
);

module.exports = router;