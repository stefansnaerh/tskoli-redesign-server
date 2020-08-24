const axios = require("axios");
const mongoose = require("mongoose");
const Assignment = require("../model/Assignment");
const AssignmentReturn = require("../model/AssignmentReturn");
const Review = require("../model/Review");

const controller = {};

/** Assignment data is coming from the Learning Guides in Strapi */

// Get all assignments
controller.getAll = async (req, res) => {
  let guides;
  let allAssignments;

  // Get Learning Guides
  try {
    guides = (await axios.get(`${process.env.CMS_URL}/guides/short`)).data;
  } catch (error) {
    return res.status(500).send({
      message: "Error: Unable to fetch Learning Guides",
      error: error,
    });
  }

  // Format Guides into Assignments
  try {
    allAssignments = guides.map((guide) => ({
      _id: guide._id,
      guide: guide.title,
      deliverable: guide.assignment,
      project: guide.project.title,
      category: guide.category,
    }));
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error: Malformed assignments", error: error });
  }

  const enhancedAssignments = await Promise.all(
    allAssignments.map(async (assignment) => {
      let extraData = {};

      try {
        extraData.latestAssignmentReturnByCurrentUser = await AssignmentReturn.findOne(
          {
            assignment: mongoose.Types.ObjectId(assignment._id),
            sender: mongoose.Types.ObjectId(req.user._id),
          }
        ).sort({ createdAt: -1 });
      } catch (error) {
        return res.status(500).send({
          message: "Error: Unable to form latestAssignmentReturnByCurrentUser",
          error: error,
        });
      }

      if (extraData.latestAssignmentReturnByCurrentUser) {
        try {
          extraData.reviewsByCurrentUser = await Review.find({
            evaluator: mongoose.Types.ObjectId(req.user._id),
            assignment: mongoose.Types.ObjectId(assignment._id),
            // Exclude user's own assignmentReturns
            assignmentReturn: {
              $not: {
                $eq: mongoose.Types.ObjectId(
                  extraData.latestAssignmentReturnByCurrentUser._id
                ),
              },
            },
          });
        } catch (error) {
          return res.status(500).send({
            message: "Error: Unable to form reviewsByCurrentUser",
            error: error,
          });
        }

        try {
          extraData.reviewsByOtherUsers = await Review.find({
            // Exclude user from search
            evaluator: { $not: { $eq: mongoose.Types.ObjectId(req.user._id) } },
            assignment: mongoose.Types.ObjectId(assignment._id),
            assignmentReturn: mongoose.Types.ObjectId(
              extraData.latestAssignmentReturnByCurrentUser._id
            ),
          });
        } catch (error) {
          return res.status(500).send({
            message: "Error: Unable to form reviewsByOtherUsers",
            error: error,
          });
        }
      }

      return {
        ...assignment,
        ...extraData,
      };
    })
  );

  return res.send(enhancedAssignments);
};

// Get specific assignment by _id
controller.get = async (req, res) => {
  let guide;
  let assignment;

  // Get Learning Guide
  try {
    guide = (await axios.get(`${process.env.CMS_URL}/guides/${req.params._id}`))
      .data;
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

  let extraData = {};

  try {
    extraData.newestAssignmentReturn = await AssignmentReturn.findOne({
      assignment: mongoose.Types.ObjectId(assignment._id),
      sender: mongoose.Types.ObjectId(req.user._id),
    }).sort({ createdAt: -1 });
  } catch (error) {
    return res.status(500).send({
      message: "Error: Unable to form newestAssignmentReturn",
      error: error,
    });
  }

  if (extraData.newestAssignmentReturn) {
    try {
      extraData.newestAssignmentReturnReview = await Review.findOne({
        assignmentReturn: mongoose.Types.ObjectId(
          extraData.newestAssignmentReturn._id
        ),
      });
    } catch (error) {
      return res.status(500).send({
        message: "Error: Unable to form newestAssignmentReturnReview",
        error: error,
      });
    }
  }

  const enhancedAssignment = {
    ...assignment,
    ...extraData,
  };

  return res.send(enhancedAssignment);
};

module.exports = controller;