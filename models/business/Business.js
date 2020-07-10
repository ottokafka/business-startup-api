const mongoose = require("mongoose");

// Business Model for registration
const BusinessSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  firebaseToken: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = Business = mongoose.model("business", BusinessSchema);
