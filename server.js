const isProd = process.env.NODE_ENV === "production";

if (!isProd) {
  require("dotenv").config();
}

const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser'); // Wei added
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = {
  openapi: '3.0.0',
  info:{
    title: 'This is the api for dev.tskoli.io',
    description: 'Here you can see how you are be able manage users, guides, returns and reviews through the API',
    version: 'v1',
    contact: {
      name: 'Smári',
      email: 'esm@tskoli.is',
      url:'https://tskoli.is/namsbraut/vefthroun/'
    }
  },
  servers:[{url:"https://localhost:3001"}]
}
const options = {
  swaggerDefinition,
  apis:['./routes/*.js']
}
console.log(__dirname);

const swaggerSpec = swaggerJSDoc(options);

const { isAuthenticated, isAdmin, rateLimit } = require("./utils/middleware.js");
const initializePassport = require("./utils/initializePassport");

initializePassport();

const app = express();

// Connect to database
mongoose.set("useCreateIndex", true);
mongoose.connect(process.env.MONGODB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json()); // Wei added
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


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
      sameSite: "none",
      secure: true,

    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const frontEnds = [
                    "https://io.tskoli.dev", 
                    "https://horsemern.xyz", 
                    "https://tskoli-intranet-website-eight.vercel.app", 
                    "https://tskoli-intranet-website-h7.vercel.app"
                  ]

// CORS setup
app.use(
  "*",
  cors((req, callback) => {
    callback(null, {
      origin: isProd
        //? "https://" + process.env.FRONTEND_DOMAIN
          // req.headers.origin if it is in frontEnds
        ? frontEnds.includes(req.headers.origin)
          ? req.headers.origin
          : "https://tskoli-intranet-website-eight.vercel.app"
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

async function adminSu(req, res, next) {
  if (req.user && req.user.isAdmin && req.session.su) {
    try {
      const user = await User.findOne({ _id: req.session.su });
      if (user) {
        // Found the su user, act as them from now on ;)
        user.sued = true; // Flag to indicate this user is sued
        req.user = user;
      }

      next();
      return;
    } catch {
      // Issue with findOne
      next();
      return;
    }
  }

  // Not an admin or not using su
  next();
}

// Admin su
app.use("*", adminSu);

// The Routes
const userRoutes = require("./routes/users");
app.use("/api/v1/users", userRoutes);

const recordingRoutes = require("./routes/recordings");
app.use("/api/v1/recordings", recordingRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/v1/auth", rateLimit, authRoutes);

const assignmentsRoutes = require("./routes/assignments");
app.use("/api/v1/assignments", isAuthenticated, assignmentsRoutes);

const assignmentReturnsRoutes = require("./routes/assignmentReturns");
app.use("/api/v1/assignmentReturns", isAuthenticated, assignmentReturnsRoutes);

const reviewsRoutes = require("./routes/reviews");
app.use("/api/v1/reviews", isAuthenticated, reviewsRoutes);

const guidesRoutes = require("./routes/guides");
app.use("/api/v1/guides", guidesRoutes);

const pagesRoutes = require("./routes/pages");
const User = require("./model/User.js");
const { login } = require("./controllers/auth.js");
app.use("/api/v1/pages", isAuthenticated, pagesRoutes);

const adminRoutes = require("./routes/admin");
app.use("/api/v1/admin", isAdmin, adminRoutes);

const galleryRoutes = require("./routes/gallery");
app.use("/api/v1/gallery", galleryRoutes);

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
