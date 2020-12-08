const router = require("express").Router();
const controller = require("../controllers/guides");

// Get all reviews
router.get("/", controller.getAll);

router.get("/Full", controller.getFull)

router.get("/Full/:_id", controller.get);

module.exports = router;
