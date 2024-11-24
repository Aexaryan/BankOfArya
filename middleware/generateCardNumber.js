

const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');



const uniqueCardNumber = async () => {
    let cardNumber;
    let cardExists = true;

    while (cardExists) {
        cardNumber = Math.floor(100000000000 + Math.random() * 900000000000);
        cardExists = await User.findOne({ cardNumber });
    }

    return cardNumber;
};

module.exports = { uniqueCardNumber }; // Export as part of an object
