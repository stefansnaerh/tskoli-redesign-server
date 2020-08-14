require("dotenv").config();

const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const cors = require("cors");

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const { isAuthenticated } = require("./utils/middleware.js");
const initializePassport = require("./utils/initializePassport");

initializePassport();

const app = express();

// if (process.env.NODE_ENV === "production") {
//   app.set("trust proxy", true);
// }

// Connect to database
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
    name: "tskoliDevIntranet",
    // proxy: process.env.USE_PROXY || true,
    cookie: {
      // sameSite: "none",
      // domain: "." + process.env.FRONTEND_DOMAIN,
      // secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// CORS setup
app.use(
  "*",
  cors((req, callback) => {
    callback(null, {
      origin:
        process.env.NODE_ENV === "production"
          ? "https://" + process.env.FRONTEND_DOMAIN
          : req.headers.origin,
      allowedHeaders: [
        "Content-Type",
        // "Origin",
        // "X-Requested-With",
        // "Accept",
        // "Authorization",
      ],
      credentials: true,
      methods: "GET,PATCH,POST,DELETE",
    });
  })
);

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/v1/auth", authRoutes);

const deliverablesRoutes = require("./routes/deliverables");
app.use("/api/v1/deliverables", isAuthenticated, deliverablesRoutes);

const deliveriesRoutes = require("./routes/deliveries");
app.use("/api/v1/deliveries", isAuthenticated, deliveriesRoutes);

const assessmentsRoutes = require("./routes/assessments");
app.use("/api/v1/assessments", isAuthenticated, assessmentsRoutes);

app.listen(3001);
