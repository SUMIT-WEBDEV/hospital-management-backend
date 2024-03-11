const Doctor = require("../models/Doctor");
const { getCurrentDate } = require("../utils/currentDate");
const uploadFiles = require("../functions/uploadFile");

module.exports.addDoctor = async (req, res) => {
  try {
    const imageUrl = req.file
      ? await uploadFiles.uploadFileToFirebase(req.file)
      : undefined;

    const doctor = await Doctor.findOne({ email: req.body.email });
    if (doctor) {
      return res.status(400).json({
        success: false,
        message: "A Doctor is already exist with given email Id",
      });
    }

    const prefixedName = "Dr. " + req.body.name.trim();
    console.log(prefixedName);

    const newDoctor = new Doctor({
      createdOn: getCurrentDate(),
      photo: imageUrl,
      name: prefixedName,
      role: req.body.role,
      email: req.body.email,
      phone: req.body.phone,
      registration_no: req.body.registration_no,

      // photo: req.file ? req.file.filename : undefined,
      // photo: req.files.length > 0 ? await uploadFiles(req.files) : undefined,
      // ...req.body,
    });

    await newDoctor.save();

    return res.status(200).json({
      success: true,
      message: "Doctor added successfully",
      data: newDoctor,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.getAll = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Doctors fetched successfully",
      data: await Doctor.find(),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.edit = async (req, res) => {
  try {
    const imageUrl = req.file
      ? await uploadFiles.uploadFileToFirebase(req.file)
      : undefined;

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(400).json({
        success: false,
        message: "No doctor found",
      });
    }

    doctor.name = req.body.name;
    doctor.role = req.body.role;
    doctor.email = req.body.email;
    doctor.phone = req.body.phone;
    doctor.registration_no = req.body.registration_no;
    // doctor.photo = imageUrl;
    if (imageUrl != null) {
      doctor.photo = imageUrl;
    }
    // if (req.files && req.files.length > 0) {
    //   doctor.photo = await uploadFiles(req.files);
    // }

    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: doctor,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.deactivate = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(400).json({
        success: false,
        message: "no doctor found",
      });
    }

    doctor.status = "De-Active";

    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Doctor deactivated succesfully",
      data: doctor,
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
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(400).json({
        success: false,
        message: "no doctor found",
      });
    }

    doctor.status = "Active";

    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Doctor activated succesfully",
      data: doctor,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
