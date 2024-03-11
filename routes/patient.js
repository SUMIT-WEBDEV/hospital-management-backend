const router = require("express").Router();

const { activate, deactivate, markPayment } = require("../controllers/patient");

const { authorize } = require("../middleware/auth");

router.put("/deactivate/:id", authorize("doctor"), deactivate);
router.put("/activate/:id", authorize("doctor"), activate);
router.put("/mark-payment/:id", authorize("doctor"), markPayment);

module.exports = router;
