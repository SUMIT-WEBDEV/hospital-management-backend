const Patient = require("../models/Patient");
const Admin = require("../models/admin");

// module.exports.getAllPatient = async (req, res) => {
//     try {
//       // console.log("--->", req.user.id);

//       const patients = await Patient.find({
//         $or: [
//           { primaryTeamIds: { $in: [req.user.id] } },
//           { secondaryTeamIds: { $in: [req.user.id] } },
//         ],
//       }).populate("health_plan");

//       // .select(["patientId","name", "health_plan"]);
//       return res.status(200).json({
//         success: true,
//         message: "Successfully fetched all patients",
//         data: patients,
//       });
//     } catch (err) {
//       return res.status(500).json({
//         success: false,
//         message: err.message,
//       });
//     }
//   };

//s

module.exports.getAllPatient = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Doctors fetched successfully",
      data: await Patient.find().populate({
        path: "health_plan",
        select: "name",
      }),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.getAdminInfo = async (req, res) => {
  try {
    const userId = req.user.id;

    const admin = await Admin.findById(userId);

    return res.status(200).json({
      success: true,
      message: "Admin data fetched successfully",
      data: admin,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const newPassword = req.body.newPassword;

    console.log(userId);
    console.log(req.body.newPassword);

    const updatedUser = await Admin.findByIdAndUpdate(
      userId,
      { password: newPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.getPatientsCountById = async (req, res) => {
  try {
    const Id = req.params.doctorId;

    try {
      const primaryCount = await Patient.countDocuments({
        primaryTeamIds: Id,
      });
      const secondaryCount = await Patient.countDocuments({
        secondaryTeamIds: Id,
      });

      res.json({
        primaryPatientsCount: primaryCount,
        secondaryPatientsCount: secondaryCount,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while fetching patient count" });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.getPatientProgram = async (req, res) => {
  try {
    const Id = req.params.doctorId;

    try {
      const primaryPatients = await Patient.find(
        {
          "primaryTeamIds.doctorId": Id,
        },
        { _id: 1 }
      ).populate({
        path: "health_plan.healthPlan",
        select: "name",
      });

      const secondaryPayments = await Patient.find(
        {
          "secondaryTeamIds.doctorId": Id,
        },
        { _id: 1 }
      ).populate({
        path: "health_plan.healthPlan",
        select: "name",
      });

      res.json({
        primaryPatients: primaryPatients,
        secondaryPayments: secondaryPayments,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while fetching patient count" });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
