const Home = require("../models/home-model");

exports.getHomeAdd = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Home Reg",
    currentPage: "Home Registration",
    editing: false,
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.getHostHomeList = (req, res, next) => {
  Home.find().then((home) => {
    // console.log(home)
    res.render("host/host-home-list", {
      homeData: home,
      pageTitle: "Host Home",
      currentPage: "Host Home",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  });
};
exports.postHomeAdd = (req, res, next) => {
  const { name, price, location, rating } = req.body;
  // console.log(req.file);
  if(!req.file){
    return res.status(422).send('no such file exists')
  }
  const image = 'houseImages/'+req.file.filename;
  const home = new Home({
    name,
    price,
    location,
    rating,
    image,
  });
  home.save().then(() => res.redirect("/host/home-list"));
};

exports.postEditHome = (req, res, next) => {
  const { id, name, price, location, rating, image } = req.body;
  Home.findById(id).then((home) => {
    home.name = name;
    home.price = price;
    home.location = location;
    home.rating = rating;
    
    if (req.file) {
      home.image = 'houseImages/'+req.file.filename;
    }

    home.save().then(() => res.redirect("/host/home-list"));
  });
};
exports.postRemoveHome = (req, res, next) => {
  const homeId = req.params.homeId;

  console.log("find home : ", homeId);
  Home.findByIdAndDelete(homeId).then((err) => {
    if (err) {
      console.log("error occer in remove home : ", err);
    }
    res.redirect("/host/home-list");
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const edit = req.query.editing == "true";
  // console.log(homeId, edit);

  Home.findById(homeId).then((home) => {
    // console.log(home)
    res.render("host/edit-home", {
      home: home,
      pageTitle: "Host Home",
      currentPage: "Host Home",
      editing: edit,
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  });
};
