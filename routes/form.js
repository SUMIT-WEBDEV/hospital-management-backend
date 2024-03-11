const router = require("express").Router();

const form = require("../controllers/form");

const { checkPatient } = require("../middleware/auth");

const { authorize } = require("../middleware/auth");

router.get("/get-all", authorize(), form.getAll);
router.get("/get-all-forms/:id", authorize(), form.getAllForms);
router.put("/update-form/:id", authorize(), form.updateForm);
// router.get('/get/:id', , form.getBypatient)
router.post("/submit-form", authorize("patient"), form.submitForm);
router.put("/deactivate/:id", authorize("admin"), form.deactivate);
router.put("/activate/:id", authorize("admin"), form.activate);
router.put("/set-type", authorize("doctor"), form.setType);
router.get("/ansForms/:id", authorize("doctor"), form.getUserAnsFormbyId);

module.exports = router;
