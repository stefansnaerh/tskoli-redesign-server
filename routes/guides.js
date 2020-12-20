const router = require("express").Router();
const controller = require("../controllers/guides");

// Get all reviews
router.get("/", controller.getAll);

router.get("/:_id", controller.get);

module.exports = router;
