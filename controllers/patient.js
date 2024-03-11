const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Healthplan = require("../models/Healthplan");

const { getPatientId } = require("../utils/getPatientId");
const { getCurrentDate } = require("../utils/currentDate");
const uploadFiles = require("../functions/uploadFile");

module.exports.addPatient = async (req, res) => {
  console.log(req.body);

  try {
    const imageUrl = req.file
      ? await uploadFiles.uploadFileToFirebase(req.file)
      : undefined;

    // const patient = await Patient.findOne({ email: req.body.email });
    // if (patient) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "A patient is already exist with given email Id",
    //   });
    // }

    // const health_program = await Healthplan.findOne({
    //   _id: req.body.health_plan,
    // });
    // if (!health_program) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "A valid health program was not found",
    //   });
    // }

    const newPatient = new Patient({
      patientId: "DAP-" + (await getPatientId()),
      createdOn: getCurrentDate(),
      // photo: req.files.length > 0 ? await uploadFiles(req.files) : undefined,
      // photo: req.file ? req.file.filename : undefined,
      photo: imageUrl,
      health_plan_date: JSON.parse(req.body.health_plan_date),
      primaryTeamIds: JSON.parse(req.body.primaryTeamIds),
      secondaryTeamIds: JSON.parse(req.body.secondaryTeamIds),
      phone: req.body.phone,
      name: req.body.name,
      email: req.body.email,
      dob: req.body.dob,
      gender: req.body.gender,
      height: req.body.height,
      weight: req.body.weight,
      caretakers_name: req.body.caretakers_name,
      caretakers_relation: req.body.caretakers_relation,
      caretakers_phone: req.body.caretakers_phone,
      caretakers_time: req.body.caretakers_time,
      health_plan: JSON.parse(req.body.healthplan),
      // amount: req.body.amount,
      payment_mode: req.body.payment_mode,
      payment_date: req.body.payment_date,
      ref_id: req.body.ref_id,
      next_payment_date: req.body.next_payment_date,
      observations: req.body.observations,
      age: req.body.age,
      health_amount_paid: JSON.parse(req.body.paids),
      // expirationTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    });

    await newPatient.save();

    return res.status(200).json({
      success: true,
      message: "Patient added successfully",
      data: newPatient,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.getAllPatients = async (req, res) => {
  try {
    // console.log("--->", req.user.id);

    const patients = await Patient.find({
      $or: [
        { "primaryTeamIds.doctorId": { $in: [req.user.id] } },
        { "secondaryTeamIds.doctorId": { $in: [req.user.id] } },
      ],
    }).populate("health_plan");

    // .select(["patientId","name", "health_plan"]);
    return res.status(200).json({
      success: true,
      message: "Successfully got all patients",
      data: patients,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.getPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      doctorId: req.user.id,
      _id: req.params.id,
    })
      .select([
        "name",
        "age",
        "gender",
        "phone",
        "photo",
        "email",
        "health_plan",
        "primaryTeamIds",
        "secondaryTeamIds",
        "caretakers_name",
        "caretakers_relation",
        "caretakers_phone",
        "caretakers_time",
        "status",
        "health_plan_date",
        "createdOn",
        "health_amount_paid",
      ])
      .populate({
        path: "health_plan.healthPlan",
        select: "name price duration",
      });

    return res.status(200).json({
      success: true,
      message: "Successfully got the patient",
      data: patient,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.editPatient = async (req, res) => {
  console.log(req.body);
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(400).json({
        success: false,
        message: "No patient found",
      });
    }

    if (req.body.healthName) {
      console.log("I am in");

      const dates = JSON.parse(req.body.added_health_plan_date);

      const healthPlan = await Healthplan.findOne({
        name: dates.healthName,
      }).select("duration");

      console.log("healthPlan", healthPlan.duration);
      const hpDuration = healthPlan?.duration;

      // const startDate = new Date(dates.startDate);
      // const endDate = new Date(dates.endDate);

      const length = patient.health_plan_date.length - 1;
      const prevHpEndDate = patient.health_plan_date[length].endDate
        .toISOString()
        .split("T")[0];

      const enrollDate = new Date().toISOString().split("T")[0];

      // const timeDifference = endDate.getTime() - startDate.getTime();
      // const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

      if (enrollDate < prevHpEndDate) {
        const prevEndDate = new Date(prevHpEndDate);
        // const enrollmentDate = new Date(enrollDate);

        const startingDate = new Date(prevEndDate);
        startingDate.setDate(prevEndDate.getDate() + 1);

        // const duration = daysDifference;

        const endingDate = new Date(startingDate);
        endingDate.setMonth(startingDate.getMonth() + hpDuration);

        console.log("startingDate:", startingDate.toISOString().split("T")[0]);
        console.log("endingDate:", endingDate.toISOString().split("T")[0]);
        const modifiedhealthPlan = {
          healthName: dates.healthName,
          startDate: startingDate,
          endDate: endingDate,
        };

        patient.health_plan.push(JSON.parse(req.body.added_health_plan));
        patient.health_plan_date.push(modifiedhealthPlan);
      } else {
        patient.health_plan.push(JSON.parse(req.body.added_health_plan));
        patient.health_plan_date.push(
          JSON.parse(req.body.added_health_plan_date)
        );
      }
    }

    // patient.health_plan_date = JSON.parse(req.body.health_plan_date);
    patient.primaryTeamIds = JSON.parse(req.body.primaryTeamIds);
    patient.secondaryTeamIds = JSON.parse(req.body.secondaryTeamIds);
    patient.phone = req.body.phone;
    patient.name = req.body.name;
    patient.email = req.body.email;
    patient.dob = req.body.dob;
    patient.gender = req.body.gender;
    patient.height = req.body.height;
    patient.weight = req.body.weight;
    patient.caretakers_name = req.body.caretakers_name;
    patient.caretakers_relation = req.body.caretakers_relation;
    patient.caretakers_phone = req.body.caretakers_phone;
    patient.caretakers_time = req.body.caretakers_time;
    // patient.health_plan = JSON.parse(req.body.health_plan);
    patient.amount = req.body.amount;
    patient.payment_mode = req.body.payment_mode;
    patient.payment_date = req.body.payment_date;
    patient.ref_id = req.body.ref_id;
    patient.next_payment_date = req.body.next_payment_date;
    patient.observations = req.body.observations;
    // patient.age = req.body.age;
    // patient.photo = req.files.length > 0 ? await uploadFiles(req.files) : patient.photo;

    await patient.save();

    return res.status(200).json({
      success: true,
      message: "Successfully updated the patient",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.updatedPatientPlan = async (req, res) => {
  try {
    const { id } = req.params; // Assuming you pass the patient ID in the URL

    // Retrieve the new data from the request body
    const { health_plan, health_plan_date, health_amount_paid } = req.body;

    // Find the patient by ID
    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Push new data into the arrays if provided
    if (health_plan) {
      patient.health_plan.push(health_plan);
    }

    if (health_plan_date) {
      patient.health_plan_date.push(health_plan_date);
    }

    if (health_amount_paid) {
      patient.health_amount_paid.push(health_amount_paid);
    }

    // Save the updated patient
    const updatedPatient = await patient.save();

    res.status(200).json(updatedPatient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.deactivate = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
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

    patient.status = "De-Active";
    patient.statusMessage = req.body.message;

    await patient.save();

    return res.status(200).json({
      success: true,
      message: "Patient deactivated succesfully",
      data: patient,
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
    const patient = await Patient.findOne({
      _id: req.params.id,
      $or: [
        { "primaryTeamIds.doctorId": { $in: [req.user.id] } },
        { "secondaryTeamIds.doctorId": { $in: [req.user.id] } },
        // { primaryTeamIds: { $in: [req.user.id] } },
        // { secondaryTeamIds: { $in: [req.user.id] } },
      ],
    });
    if (!patient) {
      return res.status(400).json({
        success: false,
        message: "no patient found for this doctor",
      });
    }

    patient.status = "Active";
    patient.statusMessage = req.body.message;

    await patient.save();

    return res.status(200).json({
      success: true,
      message: "patient activated succesfully",
      data: patient,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.markPayment = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      $or: [
        { "primaryTeamIds.doctorId": { $in: [req.user.id] } },
        { "secondaryTeamIds.doctorId": { $in: [req.user.id] } },
      ],
    }).populate("health_plan");
    if (!patient) {
      return res.status(400).json({
        success: false,
        message: "no patient found for this doctor",
      });
    }

    // patient.health_amount_paid = req.body.paids

    const payment = {
      healthId: req.body.healthId,
      paids: req.body.paids,
      createdOn: new Date(),
    };

    patient.health_amount_paid.push(payment);

    patient.paymentStatus = false;

    await patient.save();

    return res.status(200).json({
      success: true,
      message: "patient paid succesfully",
      data: patient,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
