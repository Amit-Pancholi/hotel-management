require("dotenv").config();
// core module
const path = require("path");
// external module
const express = require("express");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const { default: mongoose } = require("mongoose");
const multer = require("multer");

// local module
const rootDir = require("./utils/path-utils");
const storeRoute = require("./routes/store-routes");
const { hostRoute } = require("./routes/host-routes");
const { error404 } = require("./controller/error-controller");
const { authRoute } = require("./routes/auth-routes");
const contactUsRoute = require("./routes/contactUs-routes");

const PORT = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/airbnb";

const app = express();



const store = new mongoDBStore({
  uri: mongoUrl,
  collection: "session",
});

app.use(express.urlencoded());
app.use(express.static(path.join(rootDir, "public")));
app.use(express.static(path.join(rootDir, "uploads")));
app.use(express.static(path.join(rootDir, "Rules")))
app.set("view engine", "ejs");
app.set("views", "views");

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/houseImages");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});


app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use(
  session({
    secret: "try to learn",
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);
// app.use((req, res, next) => {
//   // console.log(req.url, req.method);
//   // for check cookies
//   console.log('session logs : ', req.session)
//   req.isLoggedIn = req.session.isLoggedIn
//   next()
// });

function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

function isGuest(req, res, next) {
  if (req.session.user?.userType === "guest") {
    return next();
  }
  return res.redirect("/sign-up"); // or send 403
}

function isHost(req, res, next) {
  if (req.session.user?.userType === "host") {
    return next();
  }
  // console.log('from isHost',req.session.user);
  return res.redirect("/sign-up"); // or send 403
}
app.use(authRoute);
app.use('/guest',isAuthenticated, isGuest, storeRoute);
app.use('/contact',isAuthenticated, contactUsRoute);
app.use("/host", isAuthenticated, isHost, hostRoute);


// app.use("/host", (req, res, next) => {
//   if (req.session.isLoggedIn) {
//     next();
//   } else {
//     res.redirect("/login");
//   }
// });


app.use(error404);

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("server connected to mongo");

    app.listen(PORT, () => {
      console.log(`Server running on address http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("error in connection of mongoDB : ", err);
  });
