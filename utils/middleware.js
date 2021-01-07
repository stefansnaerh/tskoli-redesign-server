const isAdmin = (req, res, next) => {
  // Check if user is admin or is using "su",
  // i.e. acting as another user
  console.log(req.user);
  if (req.user.isAdmin || req.session.su) {
    return next();
  }

  return res.status(401).send({ message: "Not authorized" });
};

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).send({ message: "Not authorized" });
};

const isNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(500).send({ message: "Already logged in" });
  }
  next();
};

module.exports = { isAdmin, isAuthenticated, isNotAuthenticated };
