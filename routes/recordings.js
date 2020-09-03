const router = require("express").Router();
const controller = require("../controllers/recordings");

// Get all recordings
router.get("/", controller.getAll);


module.exports = router;
