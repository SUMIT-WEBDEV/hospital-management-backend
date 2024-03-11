const Presc = require("../models/Presc");

const { getCurrentDate } = require('../utils/currentDate');

module.exports.add = async (req, res) => {
  try {
    const newPresc = new Presc({
      doctorId: req.user.id,
      patientId: req.body.patientId,
      createdOn: getCurrentDate(),
      medicines: req.body.prescriptions,
    });

    await newPresc.save();
    console.log("presc", newPresc);
    return res.status(200).json({
      success: true,
      message: "Prescription created successfully",
      data: newPresc,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.getAll = async (req, res) => {
  try {
    let presc = [];

    if (req.user.type == "Patient") {
      presc = await Presc.find({ patientId: req.user.id }).populate([
        { path: "doctorId", select: ["name", "email"] },
        { path: "patientId", select: ["name", "email"] },
      ]);
    } else if (req.user.type == "Doctor") {
      presc = await Presc.find({ doctorId: req.user.id }).populate([
        { path: "doctorId", select: ["name", "email"] },
        { path: "patientId", select: ["name", "email"] },
      ]);
    } else {
      presc = await Presc.find().populate([
        { path: "doctorId", select: ["name", "email"] },
        { path: "patientId", select: ["name", "email"] },
      ]);
    }
    return res.status(200).json({
      success: true,
      message: "Prescriptions fetched successfully",
      data: presc,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.getBypatient = async (req, res) => {
  try {
    const prescs = await Presc.find({
      doctorId: req.user.id,
      patientId: req.params.id,
    }).populate([
      { path: "doctorId", select: ["name", "email"] },
      { path: "patientId", select: ["name", "email"] },
    ]);
    return res.status(200).json({
      success: true,
      message: "Prescriptions fetched successfully",
      data: prescs,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.getLatest = async (req, res) => {
  try {
    const prescs = await Presc.findOne({ patientId: req.user.id })
      .populate([
        { path: "doctorId", select: ["name", "email"] },
        { path: "patientId", select: ["name", "email"] },
      ])
      .sort({ _id: -1 });
    return res.status(200).json({
      success: true,
      message: "Prescriptions fetched successfully",
      data: prescs,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.getLatestByDoctor = async (req, res) => {
  try {
    const prescs = await Presc.findOne({ patientId: req.params.id })
      .populate([
        { path: "doctorId", select: ["name", "email"] },
        { path: "patientId", select: ["name", "email"] },
      ])
      .sort({ _id: -1 });
    return res.status(200).json({
      success: true,
      message: "Prescriptions fetched successfully",
      data: prescs,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};