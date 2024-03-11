const router = require("express").Router();

const diets = require("../controllers/diet-chart");
const attachDiet = require("../controllers/dietChartAssignment");

const { authorize } = require("../middleware/auth");

router.get("/get-all", authorize(), diets.getAll);
router.get("/get-allDiet", authorize(), diets.getAllDiet);
router.get("/latest-diets", authorize("patient"), diets.getLatest);
router.put("/deactivate/:id", authorize("admin"), diets.deactivate);
router.put("/activate/:id", authorize("admin"), diets.activate);
router.get(
  "/latest-diet-by-doctor/:id",
  authorize("doctor"),
  diets.getLatestByDoctor
);

router.get("/getDietChartsByPatientId/:id", diets.getDietChartsByPatientId);

// DietChart assignment

router.post(
  "/createDietChartAssignment",
  authorize(),
  attachDiet.createDietChartAssignment
);

router.get(
  "/getAllDietChartAssignments",
  authorize(),
  attachDiet.getAllDietChartAssignments
);

router.get(
  "/getDietChartAssignmentsByPatientId/:id",
  authorize(),
  attachDiet.getDietChartAssignmentsByPatientId
);

module.exports = router;
