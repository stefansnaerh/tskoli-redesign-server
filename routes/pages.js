const router = require("express").Router();
const controller = require("../controllers/pages");

// Get all reviews
router.get("/category/:categorySlug", controller.getByCategory);

router.get("/:slug", controller.get);

module.exports = router;
