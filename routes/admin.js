const router = require("express").Router();
const controller = require("../controllers/admin");
const gController = require("../controllers/guides");

router.get("/form/:_id", controller.getForm);

// Get all guides if you are admin
router.get("/guides", gController.getAll)

// Create a new guide
router.post("/", controller.create);

// Edit a guide
router.patch("/:_id", controller.edit);

// Delete a guide
router.delete("/:_id", controller.delete);

module.exports = router;