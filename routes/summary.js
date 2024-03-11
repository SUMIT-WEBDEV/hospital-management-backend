const router = require("express").Router();

const { patientData, patientEnrolment, pendingPayment, employeeData, dieticianData, doctorData } = require('../controllers/summary');

const { authorize } = require("../middleware/auth");

router.get('/payment-pendings', authorize("admin"), pendingPayment);
router.get('/patient-data', authorize("admin"), patientData);
router.get('/patient-enrolments', authorize("admin"), patientEnrolment);
router.get('/employee-data', authorize("admin"), employeeData);
router.get('/dieticians-data', authorize("admin"), dieticianData);
router.get('/doctor-data', authorize("admin"), doctorData);

module.exports = router;