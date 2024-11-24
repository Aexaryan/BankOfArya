const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String },
  name: { type: String },
  email: { type: String },
  username: { type: String },
  password: { type: String },
  cardNumber: { type: String },
  balance: { type: Number, default: 1000 },
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
