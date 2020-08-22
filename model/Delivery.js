const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  // Person who is submitting the delivery
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Description of delivery
  url: {
    type: String,
    required: true,
  },
  // Description of delivery
  description: {
    type: String,
    required: false,
  },
  // Which deliverable describes this delivery
  deliverable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Deliverable",
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

module.exports = mongoose.model("Delivery", deliverySchema);
