const isAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
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
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return res.status(500).send({ message: "Already logged in" });
  }
  next();
};

module.exports = { isAdmin, isAuthenticated, isNotAuthenticated };
