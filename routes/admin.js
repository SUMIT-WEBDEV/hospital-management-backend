const router = require("express").Router();

const {
  getAllPatient,
  getPatientsCountById,
  getPatientProgram,
  updatePassword,
  getAdminInfo,
} = require("../controllers/admin");
const { authorize } = require("../middleware/auth");

router.get("/get-all-patient", authorize("admin"), getAllPatient);

router.put("/update-password", authorize("admin"), updatePassword);
router.get("/get-adminInfo", authorize("admin"), getAdminInfo);

router.get(
  "/getPatientsCountById/:doctorId",
  authorize("admin"),
  getPatientsCountById
);

router.get(
  "/getPatientProgram/:doctorId",
  authorize("admin"),
  getPatientProgram
);

module.exports = router;
