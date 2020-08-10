const router = require("express").Router();
const Deliverable = require("../model/Deliverable");
const { isAdmin } = require("../utils/guard.js");

// Get all deliverables
router.get("/", async (req, res) => {
  try {
    const allDeliverables = await Deliverable.find({});
    return res.send(allDeliverables);
  } catch {
    return res.status(500).send({ message: "An error has ocurred" });
  }
});

// Create a new deliverable
router.post("/", isAdmin, async (req, res) => {
  // Create new deliverable schema
  const newDeliverable = new Deliverable({
    name: req.body.name,
    description: req.body.description,
  });

  // Save new deliverable
  try {
    const savedDeliverable = await newDeliverable.save();
    return res.send({ message: "Success", _id: savedDeliverable._id });
  } catch (error) {
    return res.json(error);
  }
});

module.exports = router;
