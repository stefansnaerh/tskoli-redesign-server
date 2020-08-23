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
  background: {
    type: String,
  },
  careerGoals: {
    type: String,
  },
  interests: {
    type: String,
  },
  favoriteArtist: {
    type: String,
  },
  active: {
    type: Boolean,
    default: false,
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
