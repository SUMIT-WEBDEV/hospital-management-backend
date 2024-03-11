const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Form = require("../models/Form");
const DietChart = require("../models/DietChart");
const Presc = require("../models/Presc");
const { getFormatDate } = require("../utils/common");
const Appointment = require("../models/Appointment");
const Healthplan = require("../models/Healthplan");

module.exports.getPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ email: req.body.email }).populate({
      path: "health_plan",
    });

    if (!patient) {
      return res.status(400).json({
        success: false,
        message: "patient not found",
      });
    }

    const patientPrec = await Presc.find({
      patientId: patient._id,
    });

    // Add the aggregation pipeline to filter forms based on patientId and filter answers in forms based on patientId
    const forms = await Form.aggregate([
      {
        $unwind: "$actions",
      },
      {
        $match: {
          "actions.patientId": patient._id,
        },
      },
      {
        $unwind: "$questions",
      },
      {
        $addFields: {
          "questions.answers": {
            $filter: {
              input: "$questions.answers",
              as: "answer",
              cond: { $eq: ["$$answer.patientId", patient._id] },
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          doctorId: { $first: "$doctorId" },
          form_title: { $first: "$form_title" },
          answered: { $first: "$answered" },
          questions: { $push: "$questions" },
          createdOn: { $first: "$createdOn" },
          status: { $first: "$status" },
          actions: { $push: "$actions" },
          __v: { $first: "$__v" },
        },
      },
    ]);

    const allData = { patient, patientPrec, forms };

    res.status(200).json({
      success: true,
      message: "Successfully got the patient data",
      data: allData,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// module.exports.getPatient = async (req, res) => {
//   try {
//     const patient = await Patient.findOne({ email: req.body.email }).populate({
//       path: "health_plan",
//     });

//     if (!patient) {
//       return res.status(400).json({
//         success: false,
//         message: "patient not found",
//       });
//     }

//     const patientPrec = await Presc.find({
//       patientId: patient._id,
//     });

//     const forms = await Form.aggregate([
//       {
//         $match: { "actions.patientId": patient._id },
//       },
//       {
//         $unwind: "$actions",
//       },
//       {
//         $match: { "actions.patientId": patient._id },
//       },
//       {
//         $group: {
//           _id: "$_id",
//           doctorId: { $first: "$doctorId" },
//           form_title: { $first: "$form_title" },
//           answered: { $first: "$answered" },
//           questions: { $first: "$questions" },
//           createdOn: { $first: "$createdOn" },
//           status: { $first: "$status" },
//           actions: { $push: "$actions" },
//         },
//       },
//     ]);

//     const allData = { patient, patientPrec, forms };

//     res.status(200).json({
//       success: true,
//       message: "Successfully got the patient data",
//       data: allData,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// module.exports.getPatient = async (req, res) => {
//   try {
//     const patient = await Patient.findOne({ email: req.body.email }).populate({
//       path: "health_plan",
//     });

//     if (!patient) {
//       return res.status(400).json({
//         success: false,
//         message: "patient not found",
//       });
//     }

//     const patientPrec = await Presc.find({
//       patientId: patient._id,
//     });

//     const forms = await Form.find({
//       "actions.patientId" : patient._id,
//     });

//     const allData = { patient, patientPrec, forms };

//     res.status(200).json({
//       success: true,
//       message: "Successfully got the patient data",
//       data: allData,
//     });

//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

module.exports.getForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId).populate([
      {
        path: "doctorId",
        select: "name email",
      },
      {
        path: "questions.answers.patientId",
        // select: "name phone health_plan primaryTeamIds secondaryTeamIds",
        populate: {
          path: "health_plan",
          select: "name",
        },
      },
    ]);

    if (!form) {
      return res.status(400).json({
        success: false,
        message: "form not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Form successfully fetched",
      data: form,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// req.body.question;
// module.exports.getFormByQuestion = async (req, res) => {
//   try {
//     const question = req.body.question.trim().toLowerCase();

//     if (!question || typeof question !== "string") {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or missing question in the request.",
//       });
//     }

//     const formByQuestion = await Form.aggregate([
//       {
//         $unwind: "$questions",
//       },
//       {
//         $match: {
//           "questions.question_title": question,
//         },
//       },
//       {
//         $lookup: {
//           from: "patients", // Replace "patients" with the actual collection name of patients if different
//           localField: "actions.patientId",
//           foreignField: "_id",
//           as: "actions.patient",
//         },
//       },
//     ]);

//     if (!formByQuestion || formByQuestion.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Form not found for the provided question.",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Form successfully fetched",
//       data: formByQuestion,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "An error occurred while fetching the form.",
//     });
//   }
// };

// module.exports.getFormByQuestion = async (req, res) => {
//   try {
//     const formByQuestion = await Form.find({
//       "questions.question_title": req.body.question,
//     }).populate({
//       path: "questions.answers.patientId",
//       select: [
//         "primaryTeamIds",
//         "secondaryTeamIds",
//         "health_plan",
//         "name",
//         "health_plan_date",
//         "age",
//         "gender",
//         "phone",
//       ],
//       populate: {
//         path: "health_plan",
//         select: "name",
//       },
//     });
//     // console.log(formByQuestion);

//     res.status(200).json({
//       success: true,
//       message: "Form successfully fetched",
//       data: formByQuestion,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err,
//     });
//   }
// };
module.exports.getFormByQuestion = async (req, res) => {
  try {
    const questionreq = req.body.question.toLowerCase(); // Convert the input question to lowercase

    const formByQuestion = await Form.find({
      "questions.question_title": { $regex: new RegExp(questionreq, "i") },
    }).populate({
      path: "questions.answers.patientId",
      select: [
        "patientId",
        "name",
        "primaryTeamIds",
        "secondaryTeamIds",
        "health_plan",
        "health_plan_date",
        "age",
        "gender",
        "phone",
      ],
      populate: { path: "health_plan", select: "name" },
    });

    // Group answers by patientId and extract required details
    const groupedData = formByQuestion.reduce((result, form) => {
      form.questions.forEach((question) => {
        if (question.question_title.toLowerCase() === questionreq) {
          question.answers.forEach((answer) => {
            const patientId = answer.patientId?._id.toString();
            if (!result[patientId]) {
              result[patientId] = {
                patient: answer.patientId,
                answers: [],
              };
            }
            result[patientId].answers.push({
              data: answer.data,
              fillingDate: answer.fillingDate,
            });
          });
        }
      });
      return result;
    }, {});

    // Convert grouped data to an array of patient details with answers
    const patientDetailsWithAnswers = Object.values(groupedData);

    const allData = [
      { question: req.body.question },
      ...patientDetailsWithAnswers,
    ];

    res.status(200).json({
      success: true,
      message: "Form successfully fetched",
      data: allData,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.employeePerformance = async (req, res) => {
  try {
    //[ 'diet-chart', 'form', 'prescription' ]

    const dateFilter = req.query.from
      ? req.query.to
        ? {
            createdOn: {
              $gte: getFormatDate(req.query.from),
              $lte: getFormatDate(req.query.to),
            },
          }
        : {
            createdOn: {
              $gte: getFormatDate(req.query.from),
            },
          }
      : req.query.to
      ? {
          createdOn: {
            $lte: getFormatDate(req.query.to),
          },
        }
      : {};
    let data = "";

    switch (req.query.activity) {
      case "form":
        data = await Form.find({ ...dateFilter }).populate("doctorId", [
          "name",
          "email",
        ]);
        break;
      case "diet-chart":
        data = await DietChart.find({ ...dateFilter }).populate("doctorId", [
          "name",
          "email",
        ]);
        break;
      case "prescription":
        data = await Presc.find({ ...dateFilter }).populate([
          { path: "doctorId", select: ["name", "email"] },
          { path: "patientId", select: ["name", "email"] },
        ]);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "No valid activity selected",
        });
    }

    res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// list of personal observation by doctor Id
module.exports.doctorPersonalObservationList = async (req, res) => {
  try {
    const observationList = await Patient.find({
      "observations.doctorId": req.params.id,
    }).select(
      "name observations.desc observations.docName observations.createdOn"
    );

    res.status(200).json({
      success: true,
      message: "observations Data fetched successfully",
      observationList,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.patientAppointmentCount = async (req, res) => {
  try {
    const patient = await Patient.findOne({ email: req.body.email });

    const appointments = await Appointment.find({ patientId: patient.id });

    const prescriptionAppointments = [];

    for (const appointment of appointments) {
      const { doctorId, patientId, date } = appointment;
      const formattedDate = new Date(date).toISOString();
      // console.log(formattedDate);

      const prescription = await Presc.findOne({
        doctorId,
        patientId,
        createdOn: formattedDate,
      });

      if (prescription) {
        prescriptionAppointments.push(appointment);
      }
    }

    return res.json({
      success: true,
      appointmentsAll: appointments.length,
      appointmentsAttendedCount: prescriptionAppointments.length,
      appointmentsAttendedlist: prescriptionAppointments,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// get a patient detail by phone no and name
module.exports.getPatientByphoneAndEmail = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      $or: [
        { email: req.body.email },
        { phone: req.body.phone },
        // { name: { $regex: new RegExp(`^${req.body.name}$`, "i") } },
      ],
    }).select("primaryTeamIds secondaryTeamIds");

    return res.status(200).json({
      success: true,
      patient,
      primaryCount: patient.primaryTeamIds.length,
      secondaryCount: patient.secondaryTeamIds.length,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Patient not found, please check your inputs again",
    });
  }
};
