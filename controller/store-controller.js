const path = require("path");
const rootDir = require("../utils/path-utils");
const Home = require("../models/home-model");
const User = require("../models/user-model");
const { check, validationResult } = require("express-validator");
const Booking = require("../models/booking-models");

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

    res.redirect("/guest/home-list");
  } else {
    res.redirect("/guest/favourites");
  }
};

exports.postRemoveToFavourite = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);

  if (user.favourite.includes(homeId)) {
    user.favourite.pull(homeId);
    await user.save();
    res.redirect("/guest/favourites");
  } else {
    res.redirect("/guest/favourites");
  }
};

exports.getHouseRules = [
  (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return res.redirect("/login");
    }
    next();
  },

  (req, res, next) => {
    const filePath = path.join(rootDir, "Rules", "home-rules.txt");
    res.download(filePath, "rules.txt");
  },
];
exports.postHomeBooking = async (req, res, next) => {
  const homeId = req.params.homeId;
  const home = await Home.findById(homeId);
  res.render("store/book-home", {
    pageTitle: "Bookings",
    currentPage: "Booking",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
    home,
    total: 0,
  });
};
exports.postHomeBookingConfirmaton = [
  check("guestName")
    .trim()
    .notEmpty()
    .withMessage("Please enter a name")
    .isLength({
      min: 2,
    })
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Please enter a valid name"),
  check("guestEmail")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  check("guestPhone")
    .trim()
    .notEmpty()
    .withMessage("Please enter a phone number")
    .isLength({
      min: 10,
      max: 10,
    })
    .matches(/^[0-9]+$/)
    .withMessage("Please enter a valid phone number"),
  check("checkIn")
    .trim()
    .notEmpty()
    .withMessage("Please enter a check-in date")
    .isDate()
    .withMessage("Please enter a valid check-in date"),
  check("checkOut")
    .trim()
    .notEmpty()
    .withMessage("Please enter a check-out date")
    .isDate()
    .withMessage("Please enter a valid check-out date"),

  async (req, res, next) => {
    let errors = validationResult(req);
    const total = Number(req.body.total); // ensure it's a number
    const checkIn = req.body.checkIn;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // ⏰ Normalize to 00:00

    const checkInDate = new Date(checkIn);
    checkInDate.setHours(0, 0, 0, 0); // Remove time part

    // Custom error: check-in must not be in the past
    if (checkInDate < today) {
      const customError = {
        msg: "❌ Check-in date cannot be in the past",
        param: "checkIn",
        location: "body",
      };
      errors = {
        ...errors,
        errors: [...errors.array(), customError],
      };
    }
    // Manually add custom error if total is invalid
    if (total <= 0) {
      const customError = {
        msg: "❌ Invalid booking dates selected",
        param: "total",
        location: "body",
      };
      // Convert to array, add custom error, then re-wrap
      errors = {
        ...errors,
        errors: [...errors.array(), customError],
      };
    }

    if (errors.errors.length > 0) {
      const homeId = req.params.homeId;
      const home = await Home.findById(homeId);
      const user = req.session.user;
      user.phone = req.body.guestPhone;

      return res.status(422).render("store/book-home", {
        pageTitle: "Bookings",
        currentPage: "Booking",
        isLoggedIn: req.session.isLoggedIn,
        user,
        errorMsg: errors.errors.map((err) => err.msg),
        home,
        total: req.body.total,
      });
    }

    next();
  },
  async (req, res, next) => {
    const homeId = req.params.homeId;
    const {
      guestName,
      guestEmail,
      guestPhone,
      checkIn,
      checkOut,
      price,
      total,
    } = req.body;
    const existing = await Booking.exists({ homeName: homeId });
    if (!existing) {
      const booking = new Booking({
        guestName,
        guestEmail,
        guestPhone,
        homeName: homeId,
        checkIn,
        checkOut,
        price,
        total,
      });
      await booking.save();
      next();
    } else {
      res.redirect("/guest/home-booking");
    }
  },
  async (req, res, next) => {
    const homeId = req.params.homeId;
    const userId = req.session.user._id;
    const user = await User.findById(userId);

    if (!user.bookings.includes(homeId)) {
      user.bookings.push(homeId);
      await user.save();
      res.redirect("/guest/home-list");
    } else {
      res.redirect("/guest/home-booking");
    }
  },
];

exports.getHomeBooking = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate("bookings");
  const bookings = await Booking.find({
    guestEmail: req.session.user.email,
  }).populate("homeName");

  res.render("store/booking-list", {
    bookedHomes: user.bookings,
    pageTitle: "Bookings",
    currentPage: "Booking",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
    bookedHomes: bookings,
  });
};

exports.postBookingsCancel = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);

  if (user.bookings.includes(homeId)) {
    user.bookings.pull(homeId);
    await user.save();
    Booking.findByIdAndDelete(homeId).then((err) => {
      if (err) {
        console.log("error occer in remove home : ", err);
      }
    });
    res.redirect("/guest/home-booking");
  } else {
    res.redirect("/guest/home-booking");
  }
};
