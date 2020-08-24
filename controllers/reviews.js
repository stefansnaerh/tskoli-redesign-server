const axios = require("axios");
const mongoose = require("mongoose");
const Review = require("../model/Review");

const controller = {};

// Get all assignmentReturns for user
controller.getAll = async (req, res) => {
  try {
    const allReviews = await Review.find({
      evaluator: mongoose.Types.ObjectId(req.user._id),
    });
    return res.send(allReviews);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

// Get specific review by _id
controller.get = async (req, res) => {
  let review;
  let guide;
  let assignment;

  review = await Review.findOne({
    _id: req.params._id,
  }).populate("assignmentReturn");

  // Get Learning Guide
  try {
    guide = (
      await axios.get(`${process.env.CMS_URL}/guides/${review.assignment}`)
    ).data;
  } catch (error) {
    return res.status(500).send({
      message: "Error: Unable to fetch Learning Guide",
      error: error,
    });
  }

  if (!guide) {
    return res.status(404).send({ message: "Error: Assignment not found" });
  }

  try {
    // Format Guides into Assignments
    assignment = {
      _id: guide._id,
      guide: guide.Title,
      deliverable: guide.Deliver.Title,
      project: guide.project.Title,
      category: guide.Category,
    };
  } catch (error) {
    return res.status(500).send({
      message: "Error: Unable to form assignment",
      error: error,
    });
  }

  const enhancedReview = {
    ...review._doc,
    assignment,
  };

  // TODO Protect assignmentReturn?
  return res.send(enhancedReview);
};

// Create new review
controller.create = async (req, res) => {
  try {
    const newReview = await Review.create({
      evaluator: mongoose.Types.ObjectId(req.user._id),
      assignment: mongoose.Types.ObjectId(req.body.assignmentId),
      assignmentReturn: mongoose.Types.ObjectId(req.body.assignmentReturnId),
      feedback: req.body.feedback,
      vote: req.body.vote,
    });

    return res.send({ message: "Success", data: newReview });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

// Edit review by id
controller.edit = async (req, res) => {
  try {
    const review = await Review.updateOne(
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

    return res.send({ message: "Success", data: review });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

module.exports = controller;
