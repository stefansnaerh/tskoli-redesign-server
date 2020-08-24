const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  deliverable: {
    type: String,
    required: true,
  },
  project: {
    type: String,
    required: true,
  },
  category: {
    type: String,
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

module.exports = mongoose.model("Assignment", assignmentSchema);
