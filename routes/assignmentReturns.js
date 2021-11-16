const router = require("express").Router();
const controller = require("../controllers/assignmentReturns");

// Get all assignmentReturns for user
router.get("/", controller.getAll);

// Create a new assignmentReturn
router.post("/", controller.create);

// Get specific assignmentReturn by _id
router.get("/:_id", controller.get);

// Get all assignmentReturns for this assignment and this user
router.get("/forAssignment/:assignmentId", controller.getForAssignment);

// Edit assignmentReturn by id
router.patch("/:_id", controller.edit);

// Remove assignmentReturn by id
// router.delete("/:_id", controller.delete);

module.exports = router;
