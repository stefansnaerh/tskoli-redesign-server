const router = require("express").Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../model/User");
const { isAuthenticated, isNotAuthenticated } = require("../utils/guard.js");

initializePassport(
  passport,
  async (email) => User.findOne({ email: email }),
  async (_id) => User.findOne({ _id: _id })
);

router.get("/whoami", isAuthenticated, (req, res) => {
  return res.send({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
});

router.post("/login", isNotAuthenticated, function (req, res, next) {
  passport.authenticate("local", function (err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(500).send({ message: "No user found" });
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }

      return res.send({ _id: req.user._id, name: req.user.name });
    });
  })(req, res, next);
});

router.post("/register", isNotAuthenticated, async (req, res) => {
  // Check if this email is already taken
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    return res.status(500).send({ message: "Email taken" });
  }

  // Create new user schema
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  // Save new user
  try {
    const savedUser = await newUser.save();
    return res.send({ message: "Success", _id: savedUser._id });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
});

router.delete("/logout", isAuthenticated, (req, res) => {
  try {
    req.logOut();
    return res.status(200).send({ message: "User logged out" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has ocurred", error: error });
  }
});

async function initializePassport(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email);

    if (user == null) {
      return done(null, false, { message: "No user with that email" });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (error) {
      return done(error);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    return done(null, await getUserById(id));
  });
}

module.exports = router;
