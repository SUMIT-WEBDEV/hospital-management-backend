const DietChart = require("../models/DietChart");
const Patient = require("../models/Patient");

const { getCurrentDate } = require("../utils/currentDate");
const uploadFiles = require("../functions/uploadFile");
const { default: mongoose } = require("mongoose");

module.exports.addDietChart = async (req, res) => {
  try {
    const imageUrl = req.file
      ? await uploadFiles.uploadFileToFirebase(req.file)
      : undefined;

    const newDiet = new DietChart({
      doctorId: req.user.id,
      calorie_lower: req.body.calorie_lower,
      calorie_upper: req.body.calorie_upper,
      ch_lower: req.body.ch_lower,
      ch_upper: req.body.ch_upper,
      protiens: req.body.protiens,
      fats: req.body.fats,
      food_type: req.body.food,
      // file: req.files.length > 0 ? await uploadFiles(req.files) : undefined,
      file: imageUrl,
      // photo: req.file ? req.file.filename : undefined,
      cuisine_type: req.body.cuisine_type,
      createdOn: getCurrentDate(),
    });

    await newDiet.save();

    return res.status(200).json({
      success: true,
      message: "Diet chart created successfully",
      data: newDiet,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.getLatest = async (req, res) => {
  try {
    const diets = await DietChart.findOne({
      $or: [
        { doctorId: { $in: req.user.primaryTeamIds } },
        { doctorId: { $in: req.user.secondaryTeamIds } },
      ],
    })
      .populate("doctorId", ["name", "email"])
      .sort({ _id: -1 });
    return res.status(200).json({
      success: true,
      message: "diet charts fetched successfully",
      data: diets,
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
    let diets = [];

    if (req.user.type == "Doctor") {
      diets = await DietChart.find({ doctorId: req.user.id }).populate(
        "doctorId",
        ["name", "email"]
      );
    } else if (req.user.type == "Patient") {
      diets = await DietChart.find({
        $or: [
          { doctorId: { $in: req.user.primaryTeamIds } },
          { doctorId: { $in: req.user.secondaryTeamIds } },
        ],
      }).populate("doctorId", ["name", "email"]);
    } else if (req.user.type == "admin") {
      diets = await DietChart.find().populate("doctorId", ["name", "email"]);
    }

    return res.status(200).json({
      success: true,
      message: "diet charts fetched successfully",
      data: diets,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.getAllDiet = async (req, res) => {
  try {
    let diets = [];

    if (req.user.type == "Doctor") {
      diets = await DietChart.find({ status: "Active" }).populate("doctorId", [
        "name",
        "email",
      ]);
    }

    return res.status(200).json({
      success: true,
      message: "all diet charts fetched successfully",
      data: diets,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.getDietChartsByPatientId = async (req, res) => {
  try {
    const diets = await DietChart.find({
      "actions.patientId": req.params.id,
    });

    if (!diets) {
      return res.status(400).json({
        success: false,
        message: "no diet chart found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "all diet charts fetched successfully",
      data: diets,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.deactivate = async (req, res) => {
  try {
    const diet = await DietChart.findById(req.params.id);
    if (!diet) {
      return res.status(400).json({
        success: false,
        message: "no diet chart found",
      });
    }

    diet.status = "De-Active";

    await diet.save();

    return res.status(200).json({
      success: true,
      message: "Diet chart deactivated succesfully",
      data: diet,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.activate = async (req, res) => {
  try {
    const diet = await DietChart.findById(req.params.id);

    if (!diet) {
      return res.status(400).json({
        success: false,
        message: "no diet chart found",
      });
    }

    diet.status = "Active";

    await diet.save();

    return res.status(200).json({
      success: true,
      message: "Diet chart activated succesfully",
      data: diet,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.getLatestByDoctor = async (req, res) => {
  try {
    const diets = await DietChart.findOne({ doctorId: { $in: req.user.id } })
      .populate("doctorId", ["name", "email"])
      .sort({ _id: -1 });
    return res.status(200).json({
      success: true,
      message: "diet charts fetched successfully",
      data: diets,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
