const router = require("express").Router();
const {
  isAuthenticated,
  isAdmin,
} = require("../utils/middleware.js");
const controller = require("../controllers/users");

/**
 * @swagger
 * /users:
 *  get:
 *  description: Get all users
 *  tags:
 *  - users
 *  produces:
 *  - application/json
 */

router.get("/", isAuthenticated, controller.getAll);
router.get("/progress", isAdmin, controller.getProgress);
router.get("/:id", isAuthenticated, controller.getUserProgress);

module.exports = router;
