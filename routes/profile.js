const router = require("express").Router();

const profile = require("../controllers/profile");

const { authorize } = require("../middleware/auth");

router.get("/patient", authorize("patient"), profile.patient);
router.get("/doctor", authorize("doctor"), profile.doctor);

//chat
router.get("/doctorchat", authorize("doctor"), profile.doctorChat);
router.get("/patientchat/:id", authorize("doctor"), profile.patientChat);

module.exports = router;
