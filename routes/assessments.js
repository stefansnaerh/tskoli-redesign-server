const router = require("express").Router();
const controller = require("../controllers/assessments");

// Get all assessments
router.get("/", controller.getAll);

// Create a new assessment
router.post("/", controller.create);

module.exports = router;
