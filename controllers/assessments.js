const mongoose = require("mongoose");
const Assessment = require("../model/Assessment");

const controller = {};

// Get all deliveries for user
controller.getAll = async (req, res) => {
  try {
    const allAssessments = await Assessment.find({
      evaluator: mongoose.Types.ObjectId(req.user._id),
    });
    return res.send(allAssessments);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

// Get specific assessment by _id
controller.get = async (req, res) => {
  try {
    let data;

    data = await Assessment.findOne({
      _id: req.params._id,
    })
      .populate("deliverable")
      .populate("delivery");

    // TODO Protect delivery?
    return res.send(data);
  } catch (error) {
    return res.status(404).send({ message: "Delivery not found" });
  }
};

// Create new assessment
controller.create = async (req, res) => {
  try {
    const newAssessment = await Assessment.create({
      evaluator: mongoose.Types.ObjectId(req.user._id),
      deliverable: mongoose.Types.ObjectId(req.body.deliverableId),
      delivery: mongoose.Types.ObjectId(req.body.deliveryId),
      feedback: req.body.feedback,
      vote: req.body.vote,
    });

    return res.send({ message: "Success", data: newAssessment });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

// Edit assessment by id
controller.edit = async (req, res) => {
  try {
    const assessment = await Assessment.updateOne(
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

    return res.send({ message: "Success", data: assessment });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

module.exports = controller;
