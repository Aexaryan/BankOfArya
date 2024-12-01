// Importing necessary libraries
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const path = require('path');
const methodOverride = require('method-override');
require('dotenv').config();
const flash = require('connect-flash');
const User = require('./models/User'); // Adjust the path as needed





// Configuring the Express app
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secretKey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // Session expires after 24 hours
  })
);

// Passport configuration
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Flash messages middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Debugging session initialization
app.use((req, res, next) => {
  console.log('Session initialized: ', req.session);
  next();
});

// Middleware for overriding methods (for PUT/DELETE requests)
app.use(methodOverride('_method'));
// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const addUserRoutes = require('./routes/addUser');
const updateUserRoutes = require('./routes/updateUser');
const deleteUserRoutes = require('./routes/deleteUser');
const transactionRoutes = require('./routes/transaction');
const registerRoute = require('./routes/registerRoute');
const loginRoute = require('./routes/login');
const loginPage = require('./routes/login-page')
// EnsureAuthenticated and EnsureAdmin middleware
const { ensureAuthenticated } = require('./extns/auth');
const { ensureAdmin } = require('./middleware/roles');
const registerPageRoute = require('./routes/registerpageRoue');


app.use(methodOverride('_method'));// Routes setup
app.use('/', authRoutes); // Root routes (e.g., login page)
app.use('/user', ensureAuthenticated, userRoutes); // User routes (protected)
app.use('/admin', ensureAuthenticated, ensureAdmin, adminRoutes); // Admin routes (protected)

// Admin user management routes
app.use('/admin/add-user', ensureAuthenticated, ensureAdmin, addUserRoutes);
app.use('/admin/update-user', updateUserRoutes);
app.use('/admin/delete-user', deleteUserRoutes);
app.use('/login-page', loginPage)
// Transactions
app.use('/transaction', ensureAuthenticated, transactionRoutes);


// Authentication and registration routes
app.use('/registernew', registerRoute); // Registration route
app.use('/login', loginRoute); // Login route
app.use('/register-page', registerPageRoute);



// app.put('/admin/update-user/:id', async (req, res) => {
//   const userId = req.params.id;
//   const { name, email, balance } = req.body;
//   const isAdmin = req.body.isAdmin ? true : false; // Explicitly set to true/false

//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//         userId,
//         {
//             name,
//             email,
//             balance: parseFloat(balance),
//             isAdmin,
//         },
//         { new: true, runValidators: true } // Ensure validators are applied
//     );

//     if (!updatedUser) {
//         return res.status(404).json({ error: 'User not found' });
//     }

//     res.status(200).json({ message: 'User updated successfully', user: updatedUser });
// } catch (error) {
//     if (error.name === 'ValidationError') {
//         return res.status(400).json({ error: 'Validation error', details: error.errors });
//     }
//     console.error('Error updating user:', error);
//     res.status(500).json({ error: `Failed to update user: ${error.message}` });
// }

// });



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
