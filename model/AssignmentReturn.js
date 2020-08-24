const mongoose = require("mongoose");

const assignmentReturnSchema = new mongoose.Schema({
  // Person who is submitting the assignmentReturn
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Description of assignmentReturn
  url: {
    type: String,
    required: true,
  },
  // Comment about assignmentReturn
  comment: {
    type: String,
    required: false,
  },
  // Which assignment describes this assignmentReturn
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
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

module.exports = mongoose.model("AssignmentReturn", assignmentReturnSchema);