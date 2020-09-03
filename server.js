const isProd = process.env.NODE_ENV === "production";

if (!isProd) {
  require("dotenv").config();
}

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
    ...(isProd && { proxy: true }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
      ...(isProd && {
        sameSite: "none",
        secure: true,
      }),
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
      origin: isProd
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

const userRoutes = require("./routes/users");
app.use("/api/v1/users", userRoutes);

const recordingRoutes = require("./routes/recordings");
app.use("/api/v1/recordings", recordingRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/v1/auth", authRoutes);

const assignmentsRoutes = require("./routes/assignments");
app.use("/api/v1/assignments", isAuthenticated, assignmentsRoutes);

const assignmentReturnsRoutes = require("./routes/assignmentReturns");
app.use("/api/v1/assignmentReturns", isAuthenticated, assignmentReturnsRoutes);

const reviewsRoutes = require("./routes/reviews");
app.use("/api/v1/reviews", isAuthenticated, reviewsRoutes);

const guidesRoutes = require("./routes/guides");
app.use("/api/v1/guides", isAuthenticated, guidesRoutes);

const pagesRoutes = require("./routes/pages");
app.use("/api/v1/pages", isAuthenticated, pagesRoutes);

// Run server
if (isProd) {
  app.listen(3001);
} else {
  const https = require("https");
  const fs = require("fs");
  const httpsServer = https.createServer(
    {
      key: fs.readFileSync("./.certificates/localhost-api.key"),
      cert: fs.readFileSync("./.certificates/localhost-api.crt"),
    },
    app
  );

  httpsServer.listen(3001, () => {
    console.log("HTTPS Server running on port 3001");
  });
}
