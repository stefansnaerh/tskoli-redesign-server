const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema({
  // Which delivery is being assessed
  deliverable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Deliverable",
    required: true,
  },
  // Which delivery is being assessed
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Delivery",
    required: true,
  },
  // Person who is evaluating the delivery
  evaluator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Written comment about the delivery
  feedback: {
    type: String,
    required: true,
  },
  // Pass or No Pass for delivery
  vote: {
    type: Boolean,
    required: true,
  },
  // Quality of this assessment, assign by the receiver of the assessment
  rating: {
    type: String,
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

module.exports = mongoose.model("Assessment", assessmentSchema);
