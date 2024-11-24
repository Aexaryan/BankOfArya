const mongoose = require('mongoose');

const cardData = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cardNumber: { type: String, required: true, unique: true },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
});

const cardSchema = mongoose.Schema(cardData);

module.exports = mongoose.model('Card', cardSchema);
