const Delivery = require("../model/Delivery");
const Assessment = require("../model/Assessment");

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
  // Create new delivery
  try {
    const newDelivery = await Delivery.create({
      sender: req.user._id,
      deliverable: req.body.deliverableId,
      description: req.body.description,
    });

    return res.send({ message: "Success", data: newDelivery });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

// Get specific delivery by _id
controller.get = async (req, res) => {
  try {
    let data;

    data = await Delivery.findOne({
      _id: req.params._id,
    }).populate("deliverable");

    data = {
      ...data._doc,
      assessments: await Assessment.find({
        delivery: data._id,
      }),
    };

    // TODO Protect delivery?
    return res.send(data);
  } catch (error) {
    return res.status(404).send({ message: "Delivery not found" });
  }
};

// Get specific delivery by _id for assessment (excludes current user)
controller.getForDeliverable = async (req, res) => {
  try {
    const delivery = await Delivery.find({
      sender: { $not: { $eq: req.user._id } },
      deliverable: { _id: req.params.deliverableId },
    }).populate("deliverable");

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
