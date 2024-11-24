// routes/auth.js

const express = require('express');
const passport = require('passport');
const router = express.Router();
const flash = require('connect-flash');
const authController = require('../controllers/authController');


// Home route (optional, just for displaying a welcome page)
router.get('/', (req, res) => {
  res.render('index', { title: 'Welcome to the Modern Banking System' });
});

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/',
  failureFlash: true,
}), (req, res) => {
  if (req.user.isAdmin) {
    req.flash('success_msg', 'Welcome Admin!');
    res.redirect('/admin/dashboard');
  } else {
    req.flash('success_msg', 'Welcome to your dashboard!');
    res.redirect('/user/dashboard');
  }
});

// Email registration route
router.post('/register', authController.register);

// Email login route
// router.post('/login', authController.login);


router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('An error occurred while logging out.');
    }
    req.flash('success_msg', 'You have logged out successfully');
    res.redirect('/');
  });
});


module.exports = router;
