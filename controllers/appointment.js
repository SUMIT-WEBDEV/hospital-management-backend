const axios = require("axios");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");

const { getCurrentDate } = require("../utils/currentDate");
const { getFormatDate } = require("../utils/common");
const Doctor = require("../models/Doctor");

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;

const payload = {
  client_id: clientId,
  client_secret: clientSecret,
  refresh_token: refreshToken,
  grant_type: "refresh_token",
};

// Create an OAuth2 client
const oauth2Client = new OAuth2(clientId, clientSecret);

module.exports.create = async (req, res) => {
  try {
    const request = await axios.post(
      "https://www.googleapis.com/oauth2/v4/token",
      payload
    );
    //console.log(request.data);

    // Generate the url that the user will be redirected to for authentication
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
      access_token: request.data.access_token,
    });

    //console.log(oauth2Client);
    const patient = await Patient.findById(req.body.patientId);
    if (!patient) {
      return res.status(400).json({
        success: false,
        message: "Patient not found",
      });
    }

    const doctor = await Doctor.findById(req.body.doctorId);
    if (!doctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor not found",
      });
    }
    console.log(doctor);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const invitation = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: "primary",
      resource: {
        summary: "Medical Appointment",
        description: "Patient has fixed an medical appointment",
        colorId: 6,
        start: {
          date: req.body.date,
        },
        end: {
          date: req.body.date,
        },
        time: req.body.time,
        attendees: [{ email: doctor.email }, { email: patient.email }],
        reminders: {
          useDefault: true,
        },
        sendUpdates: "all",
      },
      sendNotifications: true,
    });
    //console.log(invitation);

    const newData = new Appointment({
      patientId: req.body.patientId,
      doctorId: doctor._id,
      date: getFormatDate(req.body.date),
      time: req.body.time,
      invitation: invitation.data,
      createdOn: getCurrentDate(),
    });

    await newData.save();

    return res.status(200).json({
      success: true,
      message: "Appointment created successfully",
      data: newData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.getAll = async (req, res) => {
  try {
    let appoint = [];
    if (req.user.type == "Doctor") {
      appoint = await Appointment.find({ doctorId: req.user.id }).populate([
        { path: "doctorId", select: ["name", "email"] },
        { path: "patientId", select: ["name", "email"] },
      ]);
    } else if (req.user.type == "Admin") {
      appoint = await Appointment.find().populate([
        { path: "doctorId", select: ["name", "email"] },
        { path: "patientId", select: ["name", "email"] },
      ]);
    } else if (req.user.type == "Patient") {
      appoint = await Appointment.find({ patientId: req.user.id }).populate([
        { path: "doctorId", select: ["name", "email"] },
        { path: "patientId", select: ["name", "email"] },
      ]);
    }

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      data: appoint,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.getWithDate = async (req, res) => {
  try {
    const appoints = await Appointment.find({
      doctorId: req.user.id,
      date: getFormatDate(req.params.date),
    }).count();
    // console.log(appoints);
    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      data: appoints,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
