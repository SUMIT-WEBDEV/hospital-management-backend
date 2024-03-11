const mongoose = require("mongoose");

const Doctor = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  registration_no: {
    type: String,
  },
  status: {
    type: String,
    default: "Active", //De-Active
  },
  otp: String,
  otpExpiresIn: String,
  createdOn: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("doctor", Doctor);
