const router = require("express").Router();

const obs = require("../controllers/observations");

const { authorize } = require("../middleware/auth");

router.post("/", authorize("doctor"), obs.add);
router.get("/:patientId", authorize("doctor"), obs.getAll);

module.exports = router;
