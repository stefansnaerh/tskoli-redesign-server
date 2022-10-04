const router = require("express").Router();
const controller = require("../controllers/calendar");

router.get("/", controller.getAll);

router.post("/", controller.createEvent);

router.patch("/:_id", controller.editEvent);

router.delete("/_id", controller.deleteEvent);

module.exports = router;
