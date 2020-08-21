const router = require("express").Router();
const controller = require("../controllers/assessments");

// Get all assessments
router.get("/", controller.getAll);

// Get all assessments
router.get("/:_id", controller.get);

// Create a new assessment
router.post("/", controller.create);

// Edit an assessment
router.patch("/:_id", controller.edit);

module.exports = router;
