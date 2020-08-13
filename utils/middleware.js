const isAdmin = (req, res, next) => {
  console.log("SESSION", req.session);
  console.log("USER", req.user);
  console.log("=================================");

  if (req.user.isAdmin) {
    return next();
  }

  return res.status(401).send({ message: "Not authorized" });
};

const isAuthenticated = (req, res, next) => {
  console.log("SESSION", req.session);
  console.log("USER", req.user);
  console.log("=================================");

  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).send({ message: "Not authorized" });
};

const isNotAuthenticated = (req, res, next) => {
  console.log("SESSION", req.session);
  console.log("USER", req.user);
  console.log("=================================");

  if (req.isAuthenticated()) {
    return res.status(500).send({ message: "Already logged in" });
  }
  next();
};

module.exports = { isAdmin, isAuthenticated, isNotAuthenticated };
