const mongoose = require("mongoose");

// AppointmentsSchema Model for user bookings
const AppointmentsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "business",
  },
  userName: String,
  company: String,
  address: String,
  city: String,
  state: String,
  time: String,
  date: String,
  accept: Boolean,
});
module.exports = Appointments = mongoose.model(
  "appointments",
  AppointmentsSchema
);
