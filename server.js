if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const { isAuthenticated } = require("./utils/guard.js");

const app = express();

// Connect to db
mongoose.set("useCreateIndex", true);
mongoose.connect(process.env.MONGODB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
store: new MongoStore({ mongooseConnection: mongoose.connection });

// Routes
const authRoute = require("./routes/auth");
app.use("/api/v1/auth", authRoute);

const deliverablesRoute = require("./routes/deliverables");
app.use("/api/v1/deliverables", isAuthenticated, deliverablesRoute);

app.listen(3001);
