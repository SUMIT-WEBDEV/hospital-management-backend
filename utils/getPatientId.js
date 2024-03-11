// const Patient = require('../models/Patient')

// module.exports.getPatientId = async () => {
//     const patient = await Patient.findOne().sort({_id: -1})

//     if(patient) {
//         const id = parseInt(patient.patientId.split('-')[1]);
//         //console.log(id)
//         return id+1;
//     } else {
//         return 1;
//     }
// }

const Patient = require("../models/Patient");

module.exports.getPatientId = async () => {
  const patient = await Patient.findOne().sort({ _id: -1 });

  if (patient && patient.patientId) {
    const id = parseInt(patient.patientId.split("-")[1]);
    return id + 1;
  } else {
    return 1;
  }
};
