// core module
const path = require("path");
// external module
const express = require("express");
// local module
const rootDir = require("./utils/path-utils");
const storeRoute = require("./routes/store-routes");
const {
  hostRoute
} = require("./routes/host-routes");
const {
  error404
} = require('./controller/error-controller');

const {
  default: mongoose
} = require("mongoose");

const app = express();

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.urlencoded());

app.use((req, res, next) => {
  // console.log(req.url, req.method);
  next();
});

app.use(storeRoute);
app.use("/host", hostRoute);

app.use(express.static(path.join(rootDir, 'public')))

app.use(error404);

const PORT = 3000;
const mongoUrl = 'mongodb://root:rootpassword@localhost:27017/airbnb'

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: 'admin' // this is important for root user
}).then(() => {
  console.log("server connected to mongo")

  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log("error in connection of mongoDB : ", err)
})