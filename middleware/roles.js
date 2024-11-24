// Middleware to ensure user is admin
const ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  req.flash('error_msg', 'Unauthorized access');
  res.status(403).redirect('/');
};

module.exports = { ensureAdmin };