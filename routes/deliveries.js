const router = require("express").Router();
const controller = require("../controllers/deliveries");

// Get all deliveries for user
router.get("/", controller.getAll);

// Create a new delivery
router.post("/", controller.create);

// Get specific delivery by _id
router.get("/:_id", controller.get);

// Get deliveries ready for assessment (excludes deliveries by current user)
router.get("/forDeliverable/:deliverableId", controller.getForDeliverable);

// Edit delivery by id
router.patch("/:_id", controller.edit);

// Remove delivery by id
// router.delete("/:_id", controller.delete);

module.exports = router;
