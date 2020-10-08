const router = require("express").Router();
const controller = require("../controllers/reviews");

// Get all reviews
router.get("/", controller.getAll);

// Test call
router.get("/test", controller.test);

// Get all reviews
router.get("/:_id", controller.get);

// Create a new review
router.post("/", controller.create);

// Edit an review
router.patch("/:_id", controller.edit);

module.exports = router;
