
const isAdmin = (req, res, next) => {
  // Check if user is admin or is using "su",
  // i.e. acting as another user
  //console.log(req.user);
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
const rateLimit = (req, res, next) => {
 /* if (req.isAuthenticated()) {
    return next();
  }
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const key = `${ip}-${req.originalUrl}`;
  const limit = 40;
  const expireTime = 1000 * 60 * 60; // 1 hour
  clearTimeout(req.session.rateLimitTimeout);
  req.session.rateLimitTimeout = setTimeout(() => {
    delete req.session[key];
  }, expireTime);
  // Check if user has exceeded their rate limit
  if (req.session[key]) {
    if (req.session[key] >= limit) {
      
      return res.status(429).send({ message: "Rate limit exceeded you can try again in an hour" });
    }

    req.session[key] += 1;
  } else {
    req.session[key] = 1;
  }

*/
  return next();
}

module.exports = { isAdmin, isAuthenticated, isNotAuthenticated, rateLimit };
