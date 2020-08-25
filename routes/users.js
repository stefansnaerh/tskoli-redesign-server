const router = require("express").Router();
const {
  isAuthenticated,
} = require("../utils/middleware.js");
const controller = require("../controllers/users");

router.get("/", isAuthenticated, controller.getAll);

module.exports = router;
