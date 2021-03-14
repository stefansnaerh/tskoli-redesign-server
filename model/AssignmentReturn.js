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

  liveVersion: {
    type: String,
    required: false,
  },

  imageOrGif: {
    type: String, // image URL
    required: false,
  },

  // Short introduction to the project
  introduction: {
    type: String,
    required: false,
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
  // Whether a return is already picked for reviewing
  isPicked: {
    type: Boolean,
    default: false,
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
