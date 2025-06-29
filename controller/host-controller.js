const
  Home = require("../models/home-model");

exports.getHomeAdd = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Home Reg",
    currentPage: "Home Registration",
    editing: false,
  });
};

exports.getHostHomeList = (req, res, next) => {
  Home.find().then((home) => {
    // console.log(home)
    res.render("host/host-home-list", {
      homeData: home,
      pageTitle: "Host Home",
      currentPage: "Host Home",
    });
  });
};
exports.postHomeAdd = (req, res, next) => {
  const {
    name,
    price,
    location,
    rating,
    imageUrl
  } = req.body;

  const home = new Home({
    name,
    price,
    location,
    rating,
    imageUrl
  });
  home.save().then(() => res.redirect("/host/home-list"));
};

exports.postEditHome = (req, res, next) => {
  const {
    id,
    name,
    price,
    location,
    rating,
    imageUrl
  } = req.body;
  Home.findById(id).then((home) => {
    home.name = name;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.imageUrl = imageUrl
    home.save().then(() => res.redirect("/host/home-list"));
  })
};
exports.postRemoveHome = (req, res, next) => {
  const homeId = req.params.homeId;

  console.log("find home : ", homeId);
  Home.findByIdAndDelete(homeId).then((err) => {
    if (err) {
      console.log("error occer in remove home : ", err);
    }
    res.redirect("/host/home-list");
  })
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
    });
  })
};