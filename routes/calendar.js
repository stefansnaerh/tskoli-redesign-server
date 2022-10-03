const router = require("express").Router();
const controller = require("../controllers/calendar");

router.get("/", controller.getAll);

router.post("/", controller.createEvent);

module.exports = router;
