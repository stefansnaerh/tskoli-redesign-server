const router = require("express").Router();
const {
  isAuthenticated,
  isAdmin,
} = require("../utils/middleware.js");
const controller = require("../controllers/users");

router.get("/", isAuthenticated, controller.getAll);
router.get("/progress", isAdmin, controller.getProgress);

module.exports = router;
