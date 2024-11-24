const express = require('express');
const router = express.Router();

// Login page route
router.get('/', (req, res) => {
  res.render('login-page');
});

module.exports = router;