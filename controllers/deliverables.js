const mongoose = require("mongoose");
const Deliverable = require("../model/Deliverable");
const Delivery = require("../model/Delivery");
const Assessment = require("../model/Assessment");

const controller = {};

// Get all deliverables
controller.getAll = async (req, res) => {
  try {
    const allDeliverables = await Deliverable.find();

    const enhancedDeliverables = await Promise.all(
      allDeliverables.map(async (deliverable) => {
        let extraData = {};

        extraData.latestDeliveryByCurrentUser = await Delivery.findOne({
          deliverable: mongoose.Types.ObjectId(deliverable._id),
          sender: mongoose.Types.ObjectId(req.user._id),
        }).sort({ createdAt: -1 });

        if (extraData.latestDeliveryByCurrentUser) {
          extraData.assessmentsByCurrentUser = await Assessment.find({
            evaluator: mongoose.Types.ObjectId(req.user._id),
            deliverable: mongoose.Types.ObjectId(deliverable._id),
            // Exclude user's own deliveries
            delivery: {
              $not: {
                $eq: mongoose.Types.ObjectId(
                  extraData.latestDeliveryByCurrentUser._id
                ),
              },
            },
          });

          extraData.assessmentsByOtherUsers = await Assessment.find({
            // Exclude user from search
            evaluator: { $not: { $eq: mongoose.Types.ObjectId(req.user._id) } },
            deliverable: mongoose.Types.ObjectId(deliverable._id),
            delivery: mongoose.Types.ObjectId(
              extraData.latestDeliveryByCurrentUser._id
            ),
          });
        }

        return {
          ...deliverable._doc,
          ...extraData,
        };
      })
    );

    return res.send(enhancedDeliverables);
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
    const deliverable = await Deliverable.findOne({
      _id: req.params._id,
    });

    let extraData = {};

    extraData.newestDelivery = await Delivery.findOne({
      deliverable: mongoose.Types.ObjectId(deliverable._id),
      sender: mongoose.Types.ObjectId(req.user._id),
    }).sort({ createdAt: -1 });

    if (extraData.newestDelivery) {
      extraData.newestDeliveryAssessment = await Assessment.findOne({
        delivery: mongoose.Types.ObjectId(extraData.newestDelivery._id),
      });
    }

    const enhancedDeliverable = {
      ...deliverable._doc,
      ...extraData,
    };

    return res.send(enhancedDeliverable);
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
