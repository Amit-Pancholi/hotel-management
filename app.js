require("dotenv").config();
// core module
const path = require("path");
// external module
const express = require("express");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const { default: mongoose } = require("mongoose");


// local module
const rootDir = require("./utils/path-utils");
const storeRoute = require("./routes/store-routes");
const { hostRoute } = require("./routes/host-routes");
const { error404 } = require("./controller/error-controller");
const { authRoute } = require("./routes/auth-routes");
const contactUsRoute = require("./routes/contactUs-routes");
const Home = require("./models/home-model");
const profileRoute = require("./routes/profile-routes");


const PORT = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL || 'mongodb+srv://testuser:Aq12345@cluster0.tveeyja.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

const app = express();
// app.use((err, req, res, next) => {
//   console.error("🔥 Global Error:", err);
//   res.status(500).send("Something went wrong");
// });



const store = new mongoDBStore({
  uri: mongoUrl,
  collection: "session",
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, "public")));
app.use(express.static(path.join(rootDir, "uploads")));
app.use(express.static(path.join(rootDir, "Rules")))
app.set("view engine", "ejs");
app.set("views", "views");






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
  return res.redirect("/signup"); // or send 403
}

function isHost(req, res, next) {
  if (req.session.user?.userType === "host") {
    return next();
  }
  // console.log('from isHost',req.session.user);
  return res.redirect("/signup"); // or send 403
}


app.get('/',(req, res, next) => {
  // console.log(req.body)
  Home.find().then((home) =>
    res.render("store/index", {
      homeData: home,
      pageTitle: "index",
      currentPage: "index",
      isLoggedIn: req.session.isLoggedIn,
      user:{},
    })
  );
})

app.use(authRoute);
app.use('/guest',isAuthenticated, isGuest, storeRoute);
app.use('/contact',isAuthenticated, contactUsRoute);
app.use("/host", isAuthenticated, isHost, hostRoute);
app.use("/profile", isAuthenticated, profileRoute);

// app.use("/host", (req, res, next) => {
//   if (req.session.isLoggedIn) {
//     next();
//   } else {
//     res.redirect("/login");
//   }
// });


app.use(isAuthenticated,error404);

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
