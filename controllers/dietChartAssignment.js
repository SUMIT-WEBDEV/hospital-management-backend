const DietChartAssignment = require("../models/DietChartAssignment");
const Doctor = require("../models/Doctor");
const DietChart = require("../models/DietChart");

// Create a new diet chart assignment
exports.createDietChartAssignment = async (req, res) => {
  try {
    const { doctorId, patientId, dietChartId } = req.body;

    // Check if a diet chart assignment with the same doctorId, patientId, and dietChartId already exists
    const existingAssignment = await DietChartAssignment.findOne({
      doctorId,
      patientId,
      dietChartId,
    });

    if (existingAssignment) {
      return res.status(409).json({
        success: false,
        message:
          "A diet chart assignment with the same details already exists.",
      });
    }

    const dietChartAssignment = new DietChartAssignment({
      doctorId,
      patientId,
      dietChartId,
      assignedOn: new Date(),
    });

    const savedAssignment = await dietChartAssignment.save();

    res.json({
      success: true,
      message: "Diet chart assignment created successfully.",
      data: savedAssignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the diet chart assignment.",
    });
  }
};

// Get all diet chart assignments
exports.getAllDietChartAssignments = async (req, res) => {
  try {
    const assignments = await DietChartAssignment.find()
      .populate("doctorId", "name")
      .populate("dietChartId");
    res.json({
      success: true,
      message: "Diet chart assignments retrieved successfully.",
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the diet chart assignments.",
    });
  }
};

// Get diet chart assignments by patient ID
exports.getDietChartAssignmentsByPatientId = async (req, res) => {
  try {
    const assignments = await DietChartAssignment.find({
      patientId: req.params.id,
    })
      .sort({ assignedOn: -1 })
      .populate({
        path: "dietChartId",
      })
      .populate("doctorId", "name");

    const activeAssignments = assignments.filter(
      (assignment) => assignment.dietChartId.status === "Active"
    );

    if (req.user.type === "Doctor") {
      res.status(200).json({
        success: true,
        message:
          "Diet chart assignments for the patient retrieved successfully.",
        data: activeAssignments,
      });
    } else if (req.user.type === "Patient") {
      const latestDiet =
        activeAssignments.length > 0 ? activeAssignments[0] : null;

      res.status(200).json({
        success: true,
        message:
          "Diet chart assignments for the patient retrieved successfully.",
        data: { assignments, latestDiet },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "An error occurred while retrieving the diet chart assignments for the patient.",
    });
  }
};

// Get diet chart assignments by doctor ID
exports.getDietChartAssignmentsByDoctorId = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const assignments = await DietChartAssignment.find({ doctorId })
      .populate("doctorId", "name")
      .populate("dietChartId");
    res.json({
      success: true,
      message: "Diet chart assignments for the doctor retrieved successfully.",
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "An error occurred while retrieving the diet chart assignments for the doctor.",
    });
  }
};
