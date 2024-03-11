const mongoose = require("mongoose");

const dietChartAssignmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor",
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patient",
    required: true,
  },
  dietChartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "diet-chart",
    required: true,
  },
  assignedOn: {
    type: Date,
    required: true,
  },
  //   viewDate: Date,
});

const DietChartAssignment = mongoose.model(
  "DietChartAssignment",
  dietChartAssignmentSchema
);

module.exports = DietChartAssignment;
