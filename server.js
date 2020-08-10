if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");

const users = [
  {
    id: "1597074998346",
    name: "Pedro",
    email: "pedro@brisa.is",
    password: "$2b$10$Hql6L/7Z1eD9CK1s8R8D8eMRWw8oQxVgpOBi8CWMgxy3/RkE7KG.G",
  },
];

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", checkAuthenticated, (req, res) => {
  res.send({ name: req.user.name });
});

app.post("/login", checkNotAuthenticated, function (req, res, next) {
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

      return res.send({ id: req.user.id, name: req.user.name });
    });
  })(req, res, next);
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    // Check if this email is already taken
    if (users.find((u) => req.body.email === u.email)) {
      return res.status(500).send({ message: "Email taken" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = {
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    };
    users.push(newUser);

    res.status(200).send({ message: "Success", id: newUser.id });
  } catch {
    res.status(500).send({ message: "An error has ocurred" });
  }
});

app.delete("/logout", checkAuthenticated, (req, res) => {
  try {
    req.logOut();
    res.status(200).send({ message: "User logged out" });
  } catch (e) {
    users.status(500).send({ message: "An error has ocurred" });
  }
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).send({ message: "Not authorized" });
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.status(500).send({ message: "Already logged in" });
  }
  next();
}

app.listen(3001);
