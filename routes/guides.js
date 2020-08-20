const router = require("express").Router();
const controller = require("../controllers/guides");

// Get all assessments
router.get("/", controller.getAll);

router.get("/:id", controller.get);

module.exports = router;
