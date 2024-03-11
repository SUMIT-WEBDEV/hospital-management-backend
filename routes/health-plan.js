const router = require("express").Router();

const { authorize } = require("../middleware/auth");

const { create, getAll } = require("../controllers/health-plan");

router.post("/", authorize("admin"), create);
router.get("/", authorize(), getAll);

module.exports = router;
