// core module
const path = require("path");
// external module
const express = require("express");
const mongoUrl = 'mongodb://root:rootpassword@localhost:27017/airbnb?authSource=admin';

// local module
const rootDir = require("./utils/path-utils");
const storeRoute = require("./routes/store-routes");
const {
  hostRoute
} = require("./routes/host-routes");
const {
  error404
} = require('./controller/error-controller');
const session = require("express-session");
const mongoDBStore = require('connect-mongodb-session')(session)
const {
  default: mongoose
} = require("mongoose");
const {
  authRoute
} = require("./routes/auth-routes");


const app = express();

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.urlencoded());

const store = new mongoDBStore({
  uri: mongoUrl,
  collection: 'session'
})
app.use(session({
  secret: 'try to learn',
  resave: false,
  saveUninitialized: true,
  store: store
}))
// app.use((req, res, next) => {
//   // console.log(req.url, req.method);
//   // for check cookies
//   console.log('session logs : ', req.session)
//   req.isLoggedIn = req.session.isLoggedIn
//   next()
// });

app.use(authRoute)
app.use(storeRoute);
app.use('/host', (req, res, next) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect('/login')
  }
})
app.use("/host", hostRoute);

app.use(express.static(path.join(rootDir, 'public')))

app.use(error404);

const PORT = 3000;


mongoose.connect(mongoUrl).then(() => {
  console.log("server connected to mongo")

  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log("error in connection of mongoDB : ", err)
})