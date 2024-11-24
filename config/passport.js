const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');
require('dotenv').config();
const uniqueCardNumber = require('../middleware/generateCardNumber');

module.exports = (passport) => {
  // Serialize user to session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      console.error('Error deserializing user:', err);
      done(err, null);
    }
  });

  // Validate environment variables
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error(
      'Google OAuth environment variables are not set. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env file.'
    );
  }

  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'https://bankofarya.azurewebsites.net/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            // Create a new user if one doesn't exist
            user = await User.create({
              googleId: profile.id,
              email: profile.emails[0].value,
              name: profile.displayName,
              avatar: profile.photos[0].value,
              cardNumber: await uniqueCardNumber(), // Ensure unique card numbers
              balance: 1000,
              username: profile.displayName || profile.emails[0].value.split('@')[0],
            });
          }

          return done(null, user);
        } catch (err) {
          console.error('Error during Google OAuth:', err);
          return done(err, null);
        }
      }
    )
  );

  // Local Strategy
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' }, // Use 'email' instead of 'username'
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });

          if (!user) {
            return done(null, false, { message: 'Invalid email or password.' });
          }

          // Match the password
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: 'Invalid email or password.' });
          }

          return done(null, user); // Login successful
        } catch (err) {
          console.error('Error during local authentication:', err);
          return done(err);
        }
      }
    )
  );
};
