const router = require("express").Router();

const {
  getPatient,
  getForm,
  employeePerformance,
  doctorPersonalObservationList,
  patientAppointmentCount,
  getPatientByphoneAndEmail,
  getFormByQuestion,
} = require("../controllers/data-collection");

const { authorize } = require("../middleware/auth");

router.post("/patient/", authorize(), getPatient);
router.get("/form/:formId", authorize(), getForm);
router.get("/performance", authorize(), employeePerformance);

router.get(
  "/personalObservation/:id",
  authorize(),
  doctorPersonalObservationList
);

router.post("/patientAppointmentCount", authorize(), patientAppointmentCount);

router.post(
  "/getPatientByphoneAndEmail",
  authorize(),
  getPatientByphoneAndEmail
);

router.post("/getFormByQuestion", authorize(), getFormByQuestion);

module.exports = router;
