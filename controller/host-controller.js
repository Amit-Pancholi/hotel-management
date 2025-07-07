const { check, validationResult } = require("express-validator");
const Home = require("../models/home-model");

exports.getHomeAdd = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Home Reg",
    currentPage: "Home Registration",
    editing: false,
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
    home:{}
  });
};

exports.getHostHomeList = (req, res, next) => {
  Home.find({ owner: req.session.user._id}).then((home) => {
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
exports.postHomeAdd = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Please enter a name")
    .isLength({
      min: 2,
    })
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Please enter a valid name"),
  check("price")
    .trim()
    .notEmpty()
    .withMessage("Please enter a price")
    .matches(/^[0-9]+$/)
    .withMessage("Please enter a valid price"),
  check("location")
    .trim()
    .notEmpty()
    .withMessage("Please enter a location")
    .isLength({
      min: 2,
    })
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Please enter a valid location"),
  check("rating")
    .trim()
    .notEmpty()
    .withMessage("Please enter a rating")
    .matches(/^[0-5]$/)
    .withMessage("Please enter a valid rating between 0-5"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors)
      const { name, price, location, rating } = req.body;
      return res.status(422).render("host/edit-home", {
        pageTitle: "Home Reg",
        currentPage: "Home Registration",
        editing: false,
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
        errorMsg: errors.array().map((err) => err.msg),
        home: {
          name,
          price,
          location,
          rating,
        },
      });
    }
    next();
  },
  (req, res, next) => {
    const { name, price, location, rating } = req.body;
    // console.log(req.file);
    if (!req.file) {
      return res.status(422).send("no such file exists");
    }
    const image = "houseImages/" + req.file.filename;
    const home = new Home({
      name,
      price,
      location,
      rating,
      image,
      owner: req.session.user._id,
    });
    console.log(home);
    home.save().then(() => res.redirect("/host/home-list"));
  },
];

exports.postEditHome = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Please enter a name")
    .isLength({
      min: 2,
    })
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Please enter a valid name"),
  check("price")
    .trim()
    .notEmpty()
    .withMessage("Please enter a price")
    .matches(/^[0-9]+$/)
    .withMessage("Please enter a valid price"),
  check("location")
    .trim()
    .notEmpty()
    .withMessage("Please enter a location")
    .isLength({
      min: 2,
    }),
  check("rating")
    .trim()
    .notEmpty()
    .withMessage("Please enter a rating")
    .matches(/^[0-5]$/)
    .withMessage("Please enter a valid rating"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // console.log(errors)
      const { name, price, location, rating } = req.body;
      return res.status(422).render("host/edit-home", {
        pageTitle: "Host Home",
        currentPage: "Host Home",
        editing: true,
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
        errorMsg: errors.array().map((err) => err.msg),
        home: {
          name,
          price,
          location,
          rating,
        },
      });
    }
    next();
  },

  (req, res, next) => {
    const { id, name, price, location, rating } = req.body;
    Home.findById(id).then((home) => {
      home.name = name;
      home.price = price;
      home.location = location;
      home.rating = rating;

      if (req.file) {
        home.image = "houseImages/" + req.file.filename;
      }

      home.save().then(() => res.redirect("/host/home-list"));
    });
  },
];
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
      pageTitle: "Edit Home",
      currentPage: "Edit Home",
      editing: edit,
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  });
};
