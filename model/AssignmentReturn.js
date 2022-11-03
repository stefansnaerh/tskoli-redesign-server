const mongoose = require("mongoose");

const assignmentReturnSchema = new mongoose.Schema({
  // Person who is submitting the assignmentReturn
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  coAuthors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
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
  title: {
    type: String,
    required: false,
  },

  // Which assignment describes this assignmentReturn
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guide",
    required: true,
  },
  // We are not using this any more take out and test when I have time
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
