// Importing required modules
const express = require('express'); // Express framework for building web apps
const passport = require('passport'); // Passport.js for user authentication
const router = express.Router(); // Router instance for defining routes
const User = require('../models/User'); // Importing the User model
const bcrypt = require('bcrypt'); // bcrypt for hashing passwords securely

/**
 * Generates a unique 12-digit card number for users.
 * Ensures that the generated card number does not already exist in the database.
 * 
 * @returns {Promise<number>} A unique 12-digit card number
 */
const uniqueCardNumber = async () => {
    let cardNumber; // Variable to store the generated card number
    let cardExists = true; // Flag to check if the card number already exists in the database

    // Loop until a unique card number is generated
    while (cardExists) {
        // Generate a random 12-digit card number
        cardNumber = Math.floor(100000000000 + Math.random() * 900000000000);

        // Check if the generated card number exists in the database
        cardExists = await User.findOne({ cardNumber });
    }

    // Return the unique card number
    return cardNumber;
};

// Export the uniqueCardNumber function as part of an object
module.exports = { uniqueCardNumber };
