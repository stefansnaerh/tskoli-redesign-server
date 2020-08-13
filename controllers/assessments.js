const Assessment = require("../model/Assessment");

const controller = {};

// Get all deliveries for user
controller.getAll = async (req, res) => {
  try {
    const allAssessments = await Assessment.find({ evaluator: req.user._id });
    return res.send(allAssessments);
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
    const newAssessment = await Assessment.create({
      evaluator: req.user._id,
      deliverable: req.body.deliverableId,
      delivery: req.body.deliveryId,
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

module.exports = controller;
