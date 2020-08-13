const router = require("express").Router();
const controller = require("../controllers/deliverables");
const { isAdmin } = require("../utils/middleware.js");

// Get all deliverables
router.get("/", controller.getAll);

// Create a new deliverable
router.post("/", isAdmin, controller.create);

// Get specific deliverable by _id
router.get("/:_id", controller.get);

// Edit deliverable by id
router.patch("/:_id", isAdmin, controller.edit);

// Delete deliverable by id
router.delete("/:_id", isAdmin, controller.delete);

module.exports = router;
