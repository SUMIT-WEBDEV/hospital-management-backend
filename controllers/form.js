const Form = require("../models/Form");
const Patient = require("../models/Patient");

const { getCurrentDate } = require("../utils/currentDate");

module.exports.addForm = async (req, res) => {
  try {
    const newForm = new Form({
      doctorId: req.user.id,
      form_title: req.body.form_title,
      questions: req.body.questions,
      createdOn: getCurrentDate(),
    });

    await newForm.save();

    return res.status(200).json({
      success: true,
      message: "Form created successfully",
      data: newForm,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// update form
module.exports.updateForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ error: "form not found" });
    }

    // form.doctorId = req.user.id;
    form.form_title = req.body.form_title;
    form.questions = req.body.questions;
    // form.createdOn = getCurrentDate();

    await form.save();

    return res.status(200).json({
      success: true,
      message: "Form created successfully",
      data: form,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// module.exports.getAll = async (req, res) => {
//   try {
//     let forms = [];

//     const frequencyFilter = req.query.frequency
//       ? { form_type: req.query.frequency }
//       : {};

//     if (req.user.type == "Doctor") {
//       forms = await Form.find({ doctorId: req.user.id }).populate("doctorId", [
//         "name",
//         "email",
//       ]);
//     } else if (req.user.type == "Admin") {
//       forms = await Form.find().populate("doctorId", ["name", "email"]);
//     } else if (req.user.type == "Patient") {
//       forms = await Form.find({
//         // $or: [
//         //     { doctorId: { $in: req.user.primaryTeamIds }},
//         //     { doctorId: { $in: req.user.secondaryTeamIds }},
//         // ],
//         // $or: [
//         //     { view_date: { $exists: false }},
//         //     { view_date: getCurrentDate()},
//         // ],
//         // $or: [
//         //     { view_date: { $exists: false } },
//         //     {...frequencyFilter},
//         // ],
//       })
//         .select("-actions")
//         .populate("doctorId", ["name", "email"]);
//       for (let i = 0; i < forms.length; i++) {
//         if (
//           forms[i].questions[0].answers[0]?.patientId.toString() == req.user.id
//         )
//           forms[i].answered = true;
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Forms fetched successfully",
//       data: forms,
//     });
//   } catch (err) {
//     console.log(err.message);
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

module.exports.getAll = async (req, res) => {
  try {
    // console.log(req.user.type);
    let forms = [];

    const frequencyFilter = req.query.frequency
      ? { "actions.form_type": req.query.frequency }
      : {};

    if (req.user.type == "Doctor") {
      // forms = await Form.find({ doctorId: req.user.id }).populate("doctorId", [
      forms = await Form.find({ status: "Active" }).populate("doctorId", [
        "name",
        "email",
      ]);
    } else if (req.user.type == "admin") {
      forms = await Form.find().populate("doctorId", ["name", "email"]);
    } else if (req.user.type == "Patient") {
      forms = await Form.find({
        "actions.patientId": req.user.id,
        $or: [{ "actions.view_date": { $exists: false } }, frequencyFilter],
        status: "Active",
      }).populate("doctorId", ["name", "email"]);

      for (let i = 0; i < forms.length; i++) {
        const actions = forms[i].actions.filter(
          (action) => action.patientId.toString() === req.user.id
        );

        forms[i].actions = actions;

        if (
          forms[i].questions[0].answers[0]?.patientId.toString() == req.user.id
        )
          forms[i].answered = true;
      }
    }

    return res.status(200).json({
      success: true,
      message: "Forms fetched successfully",
      data: forms,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.getAllForms = async (req, res) => {
  try {
    // console.log(req.user.type);
    let forms = [];

    const frequencyFilter = req.query.frequency
      ? { "actions.form_type": req.query.frequency }
      : {};

    forms = await Form.find({
      "actions.patientId": req.params.id,
      $or: [{ "actions.view_date": { $exists: false } }, frequencyFilter],
      status: "Active",
    }).populate("doctorId", ["name", "email"]);

    return res.status(200).json({
      success: true,
      message: "Forms fetched successfully",
      data: forms,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.submitForm = async (req, res) => {
  try {
    const form = await Form.findOne({
      _id: req.body.formId,
      patientId: req.user.id,
    });

    if (form) {
      const isAlreadyFilled = form.questions.some((question) => {
        return question.answers.some((answer) => {
          return (
            answer.patientId.toString() === req.user.id.toString() &&
            answer.fillingDate.toDateString() === new Date().toDateString()
          );
        });
      });

      if (isAlreadyFilled) {
        return res.status(400).json({
          success: false,
          message: "Daily form can be filled only once",
        });
      }

      for (let i = 0; i < form.questions.length; i++) {
        for (let j = 0; j < req.body.answers.length; j++) {
          if (form.questions[i].id == req.body.answers[j].questionId) {
            form.questions[i].answers.push({
              patientId: req.user.id,
              data: req.body.answers[j].answer,
              fillingDate: new Date(),
            });
          }
        }
      }
      if (!form.answered) form.answered = true;
      await form.save();

      return res.status(200).json({
        success: true,
        message: "Form submitted successfully",
        data: form,
      });
    } else {
      return res.status(400).json({
        success: true,
        message: "Form not found",
      });
    }
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
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(400).json({
        success: false,
        message: "no form found",
      });
    }

    form.status = "De-Active";

    await form.save();

    return res.status(200).json({
      success: true,
      message: "Form deactivated succesfully",
      data: form,
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
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(400).json({
        success: false,
        message: "no form found",
      });
    }

    form.status = "Active";

    await form.save();

    return res.status(200).json({
      success: true,
      message: "Form activated succesfully",
      data: form,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.setType = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.body.patientId,
      $or: [
        { "primaryTeamIds.doctorId": { $in: [req.user.id] } },
        { "secondaryTeamIds.doctorId": { $in: [req.user.id] } },
      ],
    });
    if (!patient) {
      return res.status(400).json({
        success: false,
        message: "no patient found for this doctor",
      });
    }

    const form = await Form.findOne({
      _id: req.body.formId,
      "actions.patientId": { $ne: req.body.patientId },
    });
    if (!form) {
      return res.status(400).json({
        success: false,
        message: "no form found",
      });
    }

    // Update the existing action or add a new one if not found
    const existingAction = form.actions.find(
      (action) => action.patientId.toString() === req.body.patientId
    );
    if (existingAction) {
      existingAction.form_type = req.body.formType;
      existingAction.view_date = getCurrentDate();
    } else {
      form.actions.push({
        form_type: req.body.formType,
        patientId: req.body.patientId,
        view_date: getCurrentDate(),
      });
    }

    await form.save();

    return res.status(200).json({
      success: true,
      message: "Form updated successfully",
      data: form,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.getUserAnsFormbyId = async (req, res) => {
  try {
    const forms = await Form.find({
      "questions.answers.patientId": req.params.id,
    });

    if (forms.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No forms found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Forms fetched successfully",
      data: forms,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
