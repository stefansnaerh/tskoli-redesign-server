const Deliverable = require("../model/Deliverable");

const controller = {};

// Get all deliverables
controller.getAll = async (req, res) => {
  try {
    const allDeliverables = await Deliverable.find({});
    return res.send(allDeliverables);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

// Create a new deliverable
controller.create = async (req, res) => {
  // Create new deliverable schema
  const newDeliverable = new Deliverable(req.body);

  // Save new deliverable
  try {
    const savedDeliverable = await newDeliverable.save();
    return res.send({ message: "Success", _id: savedDeliverable._id });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

// Get specific deliverable by _id
controller.get = async (req, res) => {
  try {
    const deliverable = await Deliverable.findOne({ _id: req.params._id });
    return res.send(deliverable);
  } catch (error) {
    return res.status(404).send({ message: "Deliverable not found" });
  }
};

// Edit deliverable by id
controller.edit = async (req, res) => {
  try {
    const deliverable = await Deliverable.updateOne(
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

    return res.send(deliverable);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

// Remove deliverable by id
controller.delete = async (req, res) => {
  try {
    const removed = await Deliverable.deleteOne({ _id: req.params._id });

    if (removed.deletedCount === 0) {
      return res.status(500).send({ message: "Nothing to delete" });
    }

    return res.send(removed);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

module.exports = controller;
