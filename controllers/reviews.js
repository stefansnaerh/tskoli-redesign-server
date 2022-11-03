const mongoose = require("mongoose");
const Review = require("../model/Review");
const AssignmentReturn = require("../model/AssignmentReturn");
const getAssignment = require("../utils/getAssignment");

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

controller.test = async (req, res) => {
  try {
    // const pickedReturns = await AssignmentReturn.find({
    //   isPicked:true
    // });
    const undefinedReturns = await AssignmentReturn.find({
      isPicked: { $ne: true },
    });
    return res.send(undefinedReturns);

    let returnsWithoutReviews = (
      await Promise.all(
        undefinedReturns.map(async (r) => {
          const review = await Review.findOne({
            assignmentReturn: mongoose.Types.ObjectId(r._id),
          });
          if (!review) return r;
        })
      )
    ).filter((r) => r);

    return res.send(returnsWithoutReviews);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

// Get specific review by _id
controller.get = async (req, res) => {
  let review;

  review = await Review.findOne({
    _id: req.params._id,
  }).populate("assignmentReturn");

  review = {
    ...review._doc,
    assignment: await getAssignment(review.assignment),
  };

  return res.send(review);
};

// Create new review
controller.create = async (req, res) => {
  let chosenReturn;
  let alreadyReviewedByUser = [];

  // Get all reviews for this assignment
  
  // Get user's reviews for this assignment
  const userReviews = await Review.find({
    evaluator: mongoose.Types.ObjectId(req.user._id),
    assignment: mongoose.Types.ObjectId(req.body.assignmentId),
  });

  if (userReviews.length > 0) {
    alreadyReviewedByUser = userReviews.map((ur) =>
      mongoose.Types.ObjectId(ur.assignmentReturn)
    );
  } else {
    // ?
  }

    // Criteria without isPicked
    const criteria = {
      _id: { $nin: alreadyReviewedByUser },
      sender: { $not: { $eq: mongoose.Types.ObjectId(req.user._id) } },
      $expr:{ $not: {$in: [mongoose.Types.ObjectId(req.user._id),"$coAuthors"]}},
      assignment: mongoose.Types.ObjectId(req.body.assignmentId),
    };
    //get all reviews for this asignment
    const allReviews = await Review.find({assignment: mongoose.Types.ObjectId(req.body.assignmentId)});
    //get the assignmentReturns specified by the creteria, oldest first
    reviewableReturns = await AssignmentReturn.find(criteria).sort({ createdAt: 1 });
    const ammountOfReviews = reviewableReturns.map( ret => {
      //ammountOfReviews is an array that shows how many reviews exists for each reviewableReturn
      return allReviews.filter(review=> review.assignmentReturn.toString() === ret._id.toString()).length
    });
    const fewestReviews = Math.min(...ammountOfReviews);
    // chosenReturn is the first instane (oldest) of return with the lowest ammount of reviews:
    chosenReturn = reviewableReturns.find( (ret,i) => ammountOfReviews[i] === fewestReviews)
 
    // If all the possibilities are exhausted return 404
    if (!chosenReturn) {
      return res
        .status(404)
        .send({ message: "No return is available" });
    }
  //}

  // Marked as picked to avoid other students
  // being assigned to the same return
  // chosenReturn.isPicked = true;
  // await chosenReturn.save();
  let newReview;
  try {
    newReview = await Review.create({
      evaluator: mongoose.Types.ObjectId(req.user._id),
      assignment: mongoose.Types.ObjectId(req.body.assignmentId),
      assignmentReturn: mongoose.Types.ObjectId(chosenReturn._id),
    });
  } catch (error) {
    chosenReturn.isPicked = false;
    await chosenReturn.save();
    return res
      .status(500)
      .send({ message: "A mysterious error has occurred...", error: error });
  }
  return res.send({
    message: "Success",
    data: { reviewId: newReview._id },
  });
};

// Edit review by id
controller.edit = async (req, res) => {
  try {
    await Review.updateOne(
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
  } catch (error) {
    return res.status(500).send({
      message: "An error has occurred while saving the Review",
      error: error,
    });
  }

  try {
    let review;

    review = await Review.findOne({
      _id: req.params._id,
    }).populate("assignmentReturn");

    review = {
      ...review._doc,
      assignment: await getAssignment(review.assignment),
    };

    return res.send(review);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

module.exports = controller;
