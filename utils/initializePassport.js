const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../model/User");

const initializePassport = async function () {
  const authenticateUser = async (email, password, done) => {
    const user = await User.findOne({ email: email });

    if (user == null) {
      return done(null, false, { message: "The email is not registered" });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "The password is incorrect" });
      }
    } catch (error) {
      return done(error);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));

  passport.serializeUser((user, done) => done(null, user._id));

  passport.deserializeUser((_id, done) => {
    User.findById(_id, (err, user) => {
      done(err, user);
    });
  });
};

module.exports = initializePassport;
