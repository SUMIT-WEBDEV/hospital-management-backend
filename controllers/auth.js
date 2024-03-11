const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Admin = require("../models/admin");

// const admin = require("firebase-admin");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sahu99516@gmail.com",
    pass: "ktbwphlscmvbvvvt",
  },
  secure: true,
  port: 587,
});

module.exports.getPatient = async (req, res) => {
  try {
    const patient = Patient.findOne({
      email: req.body.email,
    });
    return res.status(200).json({
      success: true,
      message: "patient data fetched successfully",
      data: patient,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// module.exports.login = async (req, res) => {
//   try {
//     let user = "";

//     if (req.body.user == "Doctor") {
//       user = await Doctor.findOne({
//         email: req.body.email,
//         role: req.body.user,
//       });
//     } else if (req.body.user == "Patient") {
//       user = await Patient.findOne({
//         email: req.body.email,
//         // patientId: "DAP-6",
//       });
//     } else if (req.body.user == "admin") {
//       if (
//         req.body.email == "admin@doctorapp.in" &&
//         req.body.password == "admin123"
//       ) {
//         const payload = {
//           user: {
//             id: "admin",
//             type: "admin",
//           },
//         };
//         return jwt.sign(
//           payload,
//           process.env.JWT_SECRET,
//           { expiresIn: "1 year" },
//           async (err, token) => {
//             if (err) throw err;
//             res.status(200).json({
//               success: true,
//               message: "Login successfull",
//               token,
//             });
//           }
//         );
//       } else {
//         res.status(401).json({
//           success: false,
//           message: "invalid credentials",
//         });
//       }
//     } else {
//       return res.status(500).json({
//         success: false,
//         message: "User type is required",
//       });
//     }
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000); //6 digit integer otp

//     user.otp = otp;
//     user.otpExpiresIn = Date.now() + 3600000; // 1 hour
//     await user.save();

//     const msg = {
//       to: user.email,
//       from: "Health Vriksh <saisashreek@graphiz.in>",
//       subject: "Authentication Request for Doctor App",
//       text:
//         `Hello ${user.name},\n` +
//         `Your OTP for Login access is - ${otp}\n\n` +
//         `Thanks,\n` +
//         `Team KalpaVriksh`,
//     };

//     await transporter.sendMail(msg);
//     // console.log("t", t);
//     return res.status(200).json({
//       success: true,
//       message: "OTP had send to your mailid and phone number",
//       data: {
//         user_id: user.id,
//       },
//     });
//   } catch (err) {
//     console.log("err", err.message);
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

module.exports.login = async (req, res) => {
  try {
    let users = [];

    if (req.body.user == "Doctor") {
      users = await Doctor.find({
        email: req.body.email,
        role: req.body.user,
      });
    } else if (req.body.user == "Patient") {
      users = await Patient.find({
        email: req.body.email,
        // patientId: "DAP-6",
      });
    } else if (req.body.user == "admin") {
      const admin = await Admin.findOne({
        email: req.body.email,
        password: req.body.password,
      });

      if (admin) {
        const payload = {
          user: {
            id: admin._id,
            type: "admin",
          },
        };
        return jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: "1 year" },

          async (err, token) => {
            if (err) throw err;
            res.status(200).json({
              success: true,
              message: "Login successfull",
              token,
            });
          }
        );
      } else {
        res.status(401).json({
          success: false,
          message: "invalid credentials",
        });
      }
    } else {
      return res.status(500).json({
        success: false,
        message: "User type is required",
      });
    }
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000); //6 digit integer otp

    for (const user of users) {
      user.otp = otp;
      user.otpExpiresIn = Date.now() + 3600000; // 1 hour
      await user.save();

      const msg = {
        to: user.email,
        from: "Health Vriksh <sahu99516@gmail.com>",
        subject: "Authentication Request for Doctor App",
        text:
          `Hello ${user.name},\n` +
          `Your OTP for Login access is - ${otp}\n\n` +
          `Thanks,\n` +
          `Team KalpaVriksh`,
      };

      await transporter.sendMail(msg);
    }
    return res.status(200).json({
      success: true,
      message: "OTP had send to your mailid and phone number",
      data: {
        user_ids: users.map((user) => user.id),
      },
    });
  } catch (err) {
    console.log("err", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// module.exports.submitOtp = async (req, res) => {
//   try {
//     let user = "";
//     if (req.body.user == "Doctor") {
//       user = await Doctor.findOne({
//         email: req.body.email,
//         otp: req.body.otp,
//         otpExpiresIn: { $gt: Date.now() },
//       });
//     } else if (req.body.user == "Patient") {
//       user = await Patient.findOne({
//         email: req.body.email,
//         otp: req.body.otp,
//         otpExpiresIn: { $gt: Date.now() },
//       });
//     } else {
//       return res.status(500).json({
//         success: false,
//         message: "User type is required",
//       });
//     }
//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "User doesn't exist / Invalid OTP",
//       });
//     }

//     if (user.status === "De-Active") {
//       return res.status(401).json({
//         success: false,
//         message: "Please contact admin for more information.",
//       });
//     }

//     const payload = {
//       user: {
//         id: user.id,
//         status: user.status ? user.status : undefined,
//         type: req.body.user,
//       },
//     };
//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: "1 year" },
//       async (err, token) => {
//         if (err) throw err;
//         user.otp = undefined;
//         user.otpExpiresIn = undefined;
//         await user.save();
//         res.status(200).json({
//           success: true,
//           message: "Login successfull",
//           status: user.status,
//           user: user,
//           token,
//         });
//       }
//     );
//   } catch (err) {
//     console.log(err.message);
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
module.exports.submitOtp = async (req, res) => {
  try {
    let users = [];
    if (req.body.user == "Doctor") {
      users = await Doctor.find({
        email: req.body.email,
        otp: req.body.otp,
        otpExpiresIn: { $gt: Date.now() },
      });
    } else if (req.body.user == "Patient") {
      users = await Patient.find({
        email: req.body.email,
        otp: req.body.otp,
        otpExpiresIn: { $gt: Date.now() },
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "User type is required",
      });
    }

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist / Invalid OTP",
      });
    }

    // Check if any user has "De-Active" status
    const deActiveUser = users.find((user) => user.status === "De-Active");

    if (deActiveUser) {
      return res.status(401).json({
        success: false,
        message: "Please contact admin for more information.",
      });
    }

    const userTokens = [];
    const userIDs = [];

    for (const user of users) {
      const payload = {
        user: {
          id: user.id,
          status: user.status ? user.status : undefined,
          type: req.body.user,
        },
      };
      const token = await jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1 year",
      });

      user.otp = undefined;
      user.otpExpiresIn = undefined;
      await user.save();

      userTokens.push(token);
      userIDs.push(user.id);
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      status: users[0].status, // Assuming all users have the same status
      user: users,
      tokens: userTokens,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
