const router = require("express").Router();

router.use("/appointments", require("./appointment"));
router.use("/doctors", require("./doctor"));
router.use("/health-plan", require("./health-plan"));
router.use("/diet-charts", require("./diet-charts"));
router.use("/forms", require("./form"));
router.use("/presc", require("./presc"));
router.use("/observations", require("./observations"));
router.use("/profile", require("./profile"));
router.use("/data-collection", require("./data-collection"));
router.use("/summary", require("./summary"));
router.use("/patients", require("./patient"));
router.use("/admin", require("./admin"));

module.exports = router;
