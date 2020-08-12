const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The name is not valid"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, "The email is not valid email"],
  },
  password: {
    type: String,
    required: [true, "Enter a password"],
    minlength: 6,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
