const router = require("express").Router();
const Delivery = require("../model/Delivery");
const { isAdmin } = require("../utils/guard.js");

// Get all deliveries
router.get("/", async (req, res) => {
  try {
    const allDeliveries = await Delivery.find({});
    return res.send(allDeliveries);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has ocurred", error: error });
  }
});

// Create a new delivery
router.post("/", isAdmin, async (req, res) => {
  // Create new delivery schema
  const newDelivery = new Delivery({
    name: req.body.name,
    description: req.body.description,
  });

  // Save new delivery
  try {
    const savedDelivery = await newDelivery.save();
    return res.send({ message: "Success", _id: savedDelivery._id });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has ocurred", error: error });
  }
});

// Get specific delivery by _id
router.get("/:_id", isAdmin, async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ _id: req.params._id });
    return res.send(delivery);
  } catch (error) {
    return res.status(404).send({ message: "Delivery not found" });
  }
});

// Edit delivery by id
router.patch("/:_id", isAdmin, async (req, res) => {
  try {
    const delivery = await Delivery.updateOne(
      {
        _id: req.params._id,
      },
      {
        $set: {
          ...req.body,
          updatedAt: Date.now(),
        },
      }
    );

    return res.send(delivery);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
});

// Remove delivery by id
router.delete("/:_id", isAdmin, async (req, res) => {
  try {
    const removed = await Delivery.deleteOne({ _id: req.params._id });

    if (removed.deletedCount === 0) {
      return res.status(500).send({ message: "Nothing to delete" });
    }

    return res.send(removed);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
});

module.exports = router;
