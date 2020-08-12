const Delivery = require("../model/Delivery");
const Deliverable = require("../model/Deliverable");

const controller = {};

// Get all deliveries for user
controller.getAll = async (req, res) => {
  try {
    const allDeliveries = await Delivery.find({ sender: req.user._id });
    return res.send(allDeliveries);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

// Create a new delivery
controller.create = async (req, res) => {
  // Check if passed deliverable exists
  try {
    const deliverableExists = await Deliverable.findOne({
      _id: req.body.deliverableId,
    });

    if (!deliverableExists) {
      throw new Error();
    }
  } catch (error) {
    return res.status(500).send({ message: "Deliverable does not exist" });
  }

  // Check if a delivery exists for this deliverable and only
  // allow it to go through if one of the assessments as a
  // no pass vote
  try {
    const delivery = await Delivery.findOne({
      deliverable: req.body.deliverableId,
    });

    if (delivery) {
      throw new Error();
    }
  } catch (error) {
    return res.status(500).send({ message: "Delivery cannot be added" });
  }
  return res.sendStatus(200);

  // Create new delivery schema
  const newDelivery = new Delivery({
    sender: req.user._id,
    description: req.body.description,
    deliverable: req.body.deliverableId,
    description: req.body.description,
  });

  // Save new delivery
  try {
    const savedDelivery = await newDelivery.save();
    return res.send({ message: "Success", _id: savedDelivery._id });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

// Get specific delivery by _id
controller.get = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ _id: req.params._id });
    // TODO Protect delivery?
    return res.send(delivery);
  } catch (error) {
    return res.status(404).send({ message: "Delivery not found" });
  }
};

// Edit delivery by id
controller.edit = async (req, res) => {
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
};

// Remove delivery by id
// router.delete("/:_id", async (req, res) => {
//   try {
//     const removed = await Delivery.deleteOne({ _id: req.params._id });

//     if (removed.deletedCount === 0) {
//       return res.status(500).send({ message: "Nothing to delete" });
//     }

//     return res.send(removed);
//   } catch (error) {
//     return res
//       .status(500)
//       .send({ message: "An error has occurred", error: error });
//   }
// });

module.exports = controller;
