const bcrypt = require('bcrypt');
const User = require('../models/User');

// Email Registration
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });

    req.login(newUser, (err) => {
      if (err) throw err;
      res.status(201).json({ message: 'Registered successfully', user: newUser });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Email Login
exports.login = async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });

    req.login(user, (err) => {
      if (err) return next(err);
      res.json({ message: 'Logged in successfully', user });
    });
  })(req, res, next);
};


// Logout
exports.logout = (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
};
