const router = require("express").Router();
const controller = require("../controllers/admin");

// Create a new guide
router.post("/", controller.create);

// Edit a guide
router.patch("/:_id", controller.edit);

// Delete a guide
router.delete("/:_id", controller.delete);

module.exports = router;