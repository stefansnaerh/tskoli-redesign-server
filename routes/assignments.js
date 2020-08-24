const router = require("express").Router();
const controller = require("../controllers/assignments");
const { isAdmin } = require("../utils/middleware.js");

// Get all assignments
router.get("/", controller.getAll);

// Get specific assignment by _id
router.get("/:_id", controller.get);

module.exports = router;
