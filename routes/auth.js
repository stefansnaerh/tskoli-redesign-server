const router = require("express").Router();
const {
  isAdmin,
  isAuthenticated,
  isNotAuthenticated,
} = require("../utils/middleware.js");
const controller = require("../controllers/auth");

router.post("/login", isNotAuthenticated, controller.login);
router.delete("/logout", isAuthenticated, controller.logout);
router.post("/register", isNotAuthenticated, controller.register);
router.get("/me", controller.me);
router.patch("/me", isAuthenticated, controller.meEdit);
router.get("/me/long", isAuthenticated, controller.meLong);
router.post("/su", isAdmin, controller.su);
router.post("/checkPassword", isAuthenticated, controller.checkPassword);

module.exports = router;
