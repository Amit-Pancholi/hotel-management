const favourite = require("../models/favourite-model");
const Home = require("../models/home-model");

exports.getIndex = (req, res, next) => {
  // console.log(req.body)
  Home.find().then((home) =>
    res.render("store/index", {
      homeData: home,
      pageTitle: "index",
      currentPage: "index",
      isLoggedIn: req.session.isLoggedIn,
    }))
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
    })
  })
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
      });
    }
  })
  // console.log("Home id : ", homeId);
};
exports.getFavourite = (req, res, next) => {
  favourite.find()
    .populate('homeId')
    .then(favourite => {
      const favouriteHome = favourite.map(fav => fav.homeId)
      res.render("store/favourite-list", {
        favouriteHome: favouriteHome,
        pageTitle: "Favourites",
        currentPage: "Favourite List",
        isLoggedIn: req.session.isLoggedIn,
      });
    }).catch(err => console.log('error in fetching favourite : ', err))

  // console.log(req.body)
};
exports.postAddToFavourite = (req, res, next) => {
  const homeId = req.body.id
  favourite.findOne({
    homeId: homeId
  }).then(obj => {
    if (obj) {
      console.log('home is already favourite : id :', obj)
      res.redirect('/favourites')
    } else {
      const fav = favourite({
        homeId: homeId
      })
      fav.save().then(id => {
        console.log('home is add in favourite : id : ', obj)
        res.redirect('/home-list')
      })
    }
  })



};

exports.postRemoveToFavourite = (req, res, next) => {
  const homeId = req.params.homeId;
  favourite.findOneAndDelete({
    homeId: homeId
  }).catch(err => {
    console.log("favourite is not add", err);
  }).finally(() => {
    res.redirect("/favourites");
  })
};