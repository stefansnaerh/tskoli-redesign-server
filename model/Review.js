const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  // Which assignmentReturn is being reviewed
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  // Which assignmentReturn is being reviewed
  assignmentReturn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssignmentReturn",
    required: true,
  },
  // Person who is evaluating the assignmentReturn
  evaluator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Written comment about the assignmentReturn
  feedback: {
    type: String,
    // required: true,
  },
  // Written comment about the assignmentReturn
  feedbackAnswer: {
    type: String,
  },
  // Pass or No Pass for assignmentReturn
  vote: {
    type: String,
    // required: true,
  },
  
  // Quality of this review, assign by the receiver of the review
  grade: {
    type: Number,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: false,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
