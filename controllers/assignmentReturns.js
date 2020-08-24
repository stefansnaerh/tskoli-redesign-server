const axios = require("axios");
const mongoose = require("mongoose");
const AssignmentReturn = require("../model/AssignmentReturn");
const Review = require("../model/Review");

const controller = {};

// Get all assignmentReturns for user
controller.getAll = async (req, res) => {
  try {
    const allAssignmentReturns = await AssignmentReturn.find({
      sender: mongoose.Types.ObjectId(req.user._id),
    });
    return res.send(allAssignmentReturns);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

// Create a new assignmentReturn
controller.create = async (req, res) => {
  // Create new assignmentReturn
  try {
    const newAssignmentReturn = await AssignmentReturn.create({
      sender: mongoose.Types.ObjectId(req.user._id),
      assignment: mongoose.Types.ObjectId(req.body.assignmentId),
      url: req.body.url,
      comment: req.body.comment,
    });

    return res.send({ message: "Success", data: newAssignmentReturn });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

// Get specific assignmentReturn by _id
controller.get = async (req, res) => {
  let assignmentReturn;

  assignmentReturn = await AssignmentReturn.findOne({
    _id: req.params._id,
  }).populate("assignment");

  try {
    guide = (
      await axios.get(
        `${process.env.CMS_URL}/guides/${assignmentReturn.assignment}`
      )
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

  const enhancedAssignmentReturn = {
    ...assignmentReturn._doc,
    assignment,
    reviews: await Review.find({
      assignmentReturn: mongoose.Types.ObjectId(data._id),
    }),
  };

  // TODO Protect assignmentReturn?
  return res.send(enhancedAssignmentReturn);
};

// Get specific assignmentReturn by _id for review (excludes current user)
/** HOLY MOTHER OF GOD, NEEDS ******URGENT******* REFACTOR PLEASE */
controller.getForAssignment = async (req, res) => {
  let guide;
  let assignment;
  let currentUserAssignmentReturns;
  let augmentedCurrentUserAssignmentReturns;
  let otherUsersAssignmentReturns;
  let augmentedOtherUsersAssignmentReturns;

  ///////////////////////////////////////////////////////////////
  ////// Current User's returns
  ///////////////////////////////////////////////////////////////

  currentUserAssignmentReturns = await AssignmentReturn.find({
    sender: mongoose.Types.ObjectId(req.user._id),
    assignment: mongoose.Types.ObjectId(req.params.assignmentId),
  }).sort({ createdAt: -1 });

  currentUserAssignmentReturns = await Promise.all(
    currentUserAssignmentReturns.map(async (assignmentReturn) => {
      // Bring assignment from Strap (temporary)
      try {
        guide = (
          await axios.get(
            `${process.env.CMS_URL}/guides/${assignmentReturn.assignment}`
          )
        ).data;
      } catch (error) {
        return res.status(500).send({
          message: "Error: Unable to fetch Learning Guide",
          error: error,
        });
      }

      if (!guide) {
        return res
          .status(404)
          .send({ message: "Error: Learning Guide not found" });
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

      return {
        ...assignmentReturn._doc,
        assignment,
      };
    })
  );

  /////////////////

  try {
    augmentedCurrentUserAssignmentReturns = await Promise.all(
      currentUserAssignmentReturns.map(async (assignmentReturn) => {
        const reviews = await Review.find({
          assignmentReturn: mongoose.Types.ObjectId(assignmentReturn._id),
        });

        return {
          ...assignmentReturn,
          reviews,
        };
      })
    );
  } catch (error) {
    return res.status(500).send({
      message: "Error: Unable to form augmentedCurrentUserAssignmentReturns",
      error: error,
    });
  }

  ///////////////////////////////////////////////////////////////
  ////// Other users returns
  ///////////////////////////////////////////////////////////////

  otherUsersAssignmentReturns = await AssignmentReturn.find({
    sender: { $not: { $eq: mongoose.Types.ObjectId(req.user._id) } },
    assignment: mongoose.Types.ObjectId(req.params.assignmentId),
  }).sort({ createdAt: -1 });

  otherUsersAssignmentReturns = await Promise.all(
    otherUsersAssignmentReturns.map(async (assignmentReturn) => {
      // Bring assignment from Strap (temporary)
      try {
        guide = (
          await axios.get(
            `${process.env.CMS_URL}/guides/${assignmentReturn.assignment}`
          )
        ).data;
      } catch (error) {
        return res.status(500).send({
          message: "Error: Unable to fetch Learning Guide",
          error: error,
        });
      }

      if (!guide) {
        return res
          .status(404)
          .send({ message: "Error: Learning Guide not found" });
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

      return {
        ...assignmentReturn._doc,
        assignment,
      };
    })
  );

  ////////////////

  try {
    // Get all assignmentReturns made for this review which are not made by
    // the current user, in crescent order of review count, which
    // helps the assignmentReturns with few or no counts bubble up
    augmentedOtherUsersAssignmentReturns = (
      await Promise.all(
        otherUsersAssignmentReturns.map(async (assignmentReturn) => {
          const reviews = await Review.find({
            assignmentReturn: mongoose.Types.ObjectId(assignmentReturn._id),
          });

          return {
            ...assignmentReturn,
            reviews,
          };
        })
      )
    )
      .sort((a, b) =>
        a.reviews.length > b.reviews.length
          ? 1
          : b.reviews.length > a.reviews.length
          ? -1
          : 0
      )
      .filter((assignmentReturn) => {
        // Remove assignmentReturns that the current user has already evaluated
        if (
          assignmentReturn.reviews.find((review) => {
            // Super weird situation where these values have to be
            // converted into string so this comparison works :O
            return `${review.evaluator}` === `${req.user._id}`;
          })
        ) {
          return false;
        } else {
          return true;
        }
      });
  } catch (error) {
    return res.status(500).send({
      message: "Error: Unable to form augmentedOtherUsersAssignmentReturns",
      error: error,
    });
  }

  return res.send({
    currentUserAssignmentReturns: augmentedCurrentUserAssignmentReturns,
    otherUsersAssignmentReturns: augmentedOtherUsersAssignmentReturns,
  });
};

// Edit assignmentReturn by id
controller.edit = async (req, res) => {
  try {
    const assignmentReturn = await AssignmentReturn.updateOne(
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

    return res.send(assignmentReturn);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

module.exports = controller;
