const Home = require("../models/home-model");
const User = require("../models/user-model");
exports.getIndex = (req, res, next) => {
  // console.log(req.body)
  Home.find().then((home) =>
    res.render("store/index", {
      homeData: home,
      pageTitle: "index",
      currentPage: "index",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    })
  );
};
exports.getHome = (req, res, next) => {
  // console.log(req.body)
  Home.find().then((home) => {
    // console.log(home)
    res.render("store/home-list", {
      homeData: home,
      pageTitle: "Home",
      currentPage: "Home List",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getDetails = (req, res, next) => {
  // console.log(req.body)
  const homeId = req.params.homeId;

  Home.findById(homeId).then((home) => {
    if (!home) {
      res.redirect("/home-list");
    } else {
      res.render("store/home-details", {
        home: home,
        pageTitle: "Details",
        currentPage: "Home List",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      });
    }
  });
  // console.log("Home id : ", homeId);
};
exports.getFavourite = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate("favourite");
  res.render("store/favourite-list", {
    favouriteHome: user.favourite,
    pageTitle: "Favourites",
    currentPage: "Favourite List",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });

  // console.log(req.body)
};
exports.postAddToFavourite = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);

  if (!user.favourite.includes(homeId)) {
    user.favourite.push(homeId);
    await user.save();

    res.redirect("/home-list");
  } else {
    res.redirect("/favourites");
  }
};

exports.postRemoveToFavourite = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);

  if (user.favourite.includes(homeId)) {
    user.favourite.pull(homeId);
    await user.save();
    res.redirect("/favourites");
  } else {
    res.redirect("/favourites");
  }
};

exports.getContactUs = (req, res, next) => {
  // console.log(req.body)
  res.render("store/contact-us", {
    pageTitle: "Contact Us",
    currentPage: "Contact Us",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};
