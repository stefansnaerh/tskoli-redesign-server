const router = require("express").Router();
const { isAuthenticated, isNotAuthenticated } = require("../utils/guard.js");
const controller = require("../controllers/auth");

router.post("/login", isNotAuthenticated, controller.login);
router.delete("/logout", isAuthenticated, controller.logout);
router.post("/register", isNotAuthenticated, controller.register);
router.get("/me", isAuthenticated, controller.me);

module.exports = router;
