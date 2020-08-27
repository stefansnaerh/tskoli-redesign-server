const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../model/User");
const { isEmail } = require("validator");
const { Mongoose } = require("mongoose");

const controller = {};

controller.register = async (req, res) => {
  // Check if fields are valid
  const [isValid, validationError] = await validateUserFields(req.body);
  if (!isValid) {
    return res.status(500).send({ error: validationError });
  }

  try {
    // Create new user
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      background: req.body.background,
      careerGoals: req.body.careerGoals,
      interests: req.body.interests,
      favoriteArtist: req.body.favoriteArtist,
    });

    return res.send({ message: "Success", _id: newUser._id });
  } catch (error) {
    return res.status(500).send({ error });
  }
};

controller.login = (req, res, next) => {
  passport.authenticate("local", function (err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(500).send({ message: "The credentials are invalid" });
    }

    req.login(user, function (err) {
      if (err) {
        return next(handleLoginErrors(err));
      }

      return res.send({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        active: req.user.active,
      });
    });
  })(req, res, next);
};

controller.logout = (req, res) => {
  try {
    req.logout();
    return res.send({ message: "The user was logged out" });
  } catch (error) {
    return res.status(500).send({ error });
  }
};

controller.me = (req, res) => {
  return res.send({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    active: req.user.active,
  });
};

controller.meLong = async (req, res) => {
  let user = (await User.findOne({ _id: req.user._id }))._doc;
  delete user.password;
  delete user.isAdmin;
  delete user.staff;
  delete user.active;
  return res.send(user);
};

controller.meEdit = async (req, res) => {
  let data = req.body;

  if (data.password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);
    data.password = hashedPassword;
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: data },
      { new: true }
    );
    return res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      active: updatedUser.active,
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
};

controller.checkPassword = async (req, res) => {
  passport.authenticate("local", function (err, user) {
    if (err) {
      return res.sendStatus(500);
    }

    if (!user) {
      return res.status(500).send({ message: "The credentials are invalid" });
    }

    return res.send({ message: "Ok" });
  })(req, res);
};

const validateUserFields = async (fields) => {
  if (!fields.name) {
    return [false, "The name is invalid"];
  }

  if (!fields.email || !isEmail(fields.email)) {
    return [false, "The email is invalid"];
  }

  const userExists = await User.findOne({ email: fields.email });
  if (userExists) {
    return [false, "This email is already registered"];
  }

  if (!fields.password) {
    return [false, "The password is invalid"];
  }

  if (fields.password.length < 6) {
    return [false, "The password must be at least 6 characters long"];
  }

  return [true, null];
};

const handleLoginErrors = (error) => {
  // Incorrect email
  if (error.message === "incorrect email") {
    return "This email is not registered";
  }

  // Incorrect password
  if (error.message === "incorrect password") {
    return "This password is incorrect";
  }

  // Validation errors
  return error;
};

module.exports = controller;
