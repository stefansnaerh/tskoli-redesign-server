const router = require("express").Router();
const controller = require("../controllers/gallery");

router.get("/", controller.getAssignments);

module.exports = router;
