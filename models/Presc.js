const mongoose = require("mongoose");

const Medicine = new mongoose.Schema({
  medType: String,
  medName: String,
  mornDose: String,
  aftDose: String,
  eveDose: String,
  frequency: String,
  duration: String,
  durDays: Number,
  specinst: String,
});

const Presc = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor",
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patient",
  },
  createdOn: Date,
  medicines: [Medicine],
});

module.exports = mongoose.model("prescription", Presc);