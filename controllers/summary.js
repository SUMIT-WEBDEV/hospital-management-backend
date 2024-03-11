const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Form = require("../models/Form");
const DietChart = require("../models/DietChart");
const Healthplan = require("../models/Healthplan");

const { getFormatDate } = require("../utils/common");
const { getCurrentDate } = require("../utils/currentDate");
const mongoose = require("mongoose");

module.exports.patientData = async (req, res) => {
  try {
    const patients = await Patient.find().populate("health_plan");

    const healthPlanIds = [];
    const planDetails = [];

    patients.forEach((patient) => {
      //console.log(healthPlanIds);
      if (healthPlanIds.includes(patient.health_plan.id)) {
        for (let i = 0; i < planDetails.length; i++) {
          if (planDetails[i].id === patient.health_plan.id) {
            planDetails[i].active_patients++;
            planDetails[i].new_patients =
              patient.createdOn >
              new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
                ? 1
                : undefined;
          }
        }
      } else {
        healthPlanIds.push(patient.health_plan.id);

        planDetails.push({
          id: patient.health_plan.id,
          plan_name: patient.health_plan.name,
          active_patients: 1,
          new_patients:
            patient.createdOn >
            new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
              ? 1
              : undefined,
        });
      }
    });

    return res.status(200).json({
      success: true,
      message: "data fetched successfully",
      data: {
        planDetails,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.patientEnrolment = async (req, res) => {
  try {
    const health_program = await Healthplan.findById(req.query.programId);
    if (!health_program) {
      return res.status(400).json({
        success: false,
        message: "A valid health program was not found",
      });
    }

    const startFilter = req.query.startDate
      ? { createdOn: getFormatDate(req.query.startDate) }
      : {};
    const yearFilter = req.query.year
      ? {
          createdOn: {
            $gte: getFormatDate(req.query.year),
            $lte: getFormatDate((parseInt(req.query.year) + 1).toString()),
          },
        }
      : {};

    const patients = await Patient.find({
      health_plan: req.query.programId,
      ...startFilter,
      ...yearFilter,
    });

    let newCount = 0;

    patients.map((patient) => {
      if (
        patient.createdOn >
        new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
      ) {
        newCount++;
      }
    });

    return res.status(200).json({
      success: true,
      message: "data fetched successfully",
      data: {
        program_name: health_program.name,
        active_count: patients.length,
        new_count: newCount,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// module.exports.pendingPayment = async (req, res) => {
//     try {
//         const patients = await Patient.find({ paymentStatus: false }).populate('health_plan', ['name']);

//         return res.status(200).json({
//             success: true,
//             message: "Patients list fetched successfully",
//             data: patients
//         })
//     } catch (err) {
//         return res.status(500).json({
//             success: false,
//             message: err.message,
//         })
//     }
// };

module.exports.pendingPayment = async (req, res) => {
  try {
    const patients = await Patient.find({ paymentStatus: false }).populate(
      "health_plan.healthPlan",
      ["name", "price"]
    );

    // const populatedPatients = await Promise.all(
    //   patients.map(async (patient) => {
    //     const primaryDoctors = await Doctor.find({
    //       _id: {
    //         $in: patient.primaryTeamIds.map((id) =>
    //           mongoose.Types.ObjectId.isValid(id) ? id : null
    //         ),
    //       },
    //     }).select("_id name");

    //     const secondaryDoctors = await Doctor.find({
    //       _id: {
    //         $in: patient.secondaryTeamIds.map((id) =>
    //           mongoose.Types.ObjectId.isValid(id) ? id : null
    //         ),
    //       },
    //     }).select("_id name");

    // const {
    //   primaryTeamIds,
    //   secondaryTeamIds,
    //   photo,
    //   weight,
    //   email,
    //   dob,
    //   observations,
    //   age,
    //   gender,
    //   height,
    //   caretakers_relation,
    //   caretakers_phone,
    //   caretakers_name,
    //   ref_id,
    //   ...patientData
    // } = patient.toJSON();

    // let allData = {
    //   ...patientData,
    //   primaryDoctors,
    //   secondaryDoctors,
    // };

    // const populatedPatient = {
    //   patientData,
    //   primaryDoctors,
    //   secondaryDoctors,
    // };
    // const populatedPatient = {
    //   allData,
    // };

    //     return allData;
    //   })
    // // );

    return res.status(200).json({
      success: true,
      message: "Patients list fetched successfully",
      data: patients,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.employeeData = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    const health_programs = await Healthplan.find();

    const data = [];

    for (let i = 0; i < doctors.length; i++) {
      const obj = {
        id: doctors[i].id,
        doctor_name: doctors[i].name,
        primary_patients: await Patient.find({
          primaryTeamIds: doctors[i].id,
        }).count(),
        secondary_patients: await Patient.find({
          secondaryTeamIds: doctors[i].id,
        }).count(),
        programs: [],
      };

      data.push(obj);
    }

    for (let j = 0; j < data.length; j++) {
      for (let i = 0; i < health_programs.length; i++) {
        const patientCount = await Patient.find({
          health_plan: health_programs[i].id,
          $or: [
            { primaryTeamIds: { $in: [data[j].id] } },
            { secondaryTeamIds: { $in: [data[j].id] } },
          ],
        }).count();
        if (patientCount > 0) {
          data[j].programs.push({
            program_name: health_programs[i].name,
            count: patientCount,
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Employee data fetched successfully",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.dieticianData = async (req, res) => {
  try {
    const statusFilter = req.query.status
      ? req.query.status == "Active"
        ? { status: "Active" }
        : req.query.status == "De-Active"
        ? { status: "De-Active" }
        : {}
      : {};
    const dieticians = await Doctor.find({
      role: "Dietitian",
      ...statusFilter,
    });
    return res.status(200).json({
      success: true,
      message: "Dieticians data fetched successfully",
      data: dieticians,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.doctorData = async (req, res) => {
  try {
    const programFilter = req.query.program ? {} : {};
    const dieticians = await Doctor.find({ ...statusFilter });
    return res.status(200).json({
      success: true,
      message: "Doctors data fetched successfully",
      data: dieticians,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
