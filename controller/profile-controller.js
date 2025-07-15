const User = require("../models/user-model");
const { check, validationResult } = require("express-validator");
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId); // ✅ use the User model

    if (!user) {
      return res.redirect("/login"); // or show error page
    }

    res.render("profile", {
      pageTitle: "Profile",
      currentPage: "Profile",
      isLoggedIn: req.session.isLoggedIn,
      user,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    next(err);
  }
};

exports.getProfileEdit = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.redirect("/login");
    }
    res.render("profile-edit", {
      pageTitle: "Profile",
      currentPage: "Profile",
      isLoggedIn: req.session.isLoggedIn,
      user,
    });
  } catch (err) {
    console.log('Error in edit user profile : ',err)
    next(err)
  }
};

exports.postProfileEdit = [
  check("firstName")
    .trim()
    .notEmpty()
    .withMessage("Please enter a first name")
    .isLength({
      min: 2,
    })
    .withMessage("First name must be at least 2 characters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  check("lastName")
    .trim()
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),
  check("bioData"),
  check("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Please enter a phone number")
    .isLength({
      min: 10,
      max: 10,
    })
    .withMessage("Please enter a valid phone number")
    .matches(/^[0-9]+$/)
    .withMessage("Please enter a valid phone number"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // console.log(errors)
      const { firstName, lastName, bioData, phoneNumber } = req.body;
      return res.status(422).render("profile-edit", {
        pageTitle: "Profile",
        currentPage: "Profile",
        isLoggedIn: req.session.isLoggedIn,
        errorMsg: errors.array().map((err) => err.msg),
        user: {
         firstName,
         lastName,
         bioData,
         phoneNumber
        },
      });
    }
    next();
  },
  async (req, res, next) => {
    try {
      const { firstName, lastName, bioData, phoneNumber } = req.body;
      const userId = req.session.user._id;
      const user = await User.findById(userId);
      if (!user) {
        return res.redirect("/login");
      }
      user.firstName = firstName;
      user.lastName = lastName;
      user.bioData = bioData;
      user.phoneNumber = phoneNumber;

      if (req.file) {
        user.profileImage = req.file.path;
      }
      await user.save();
      res.redirect("/profile");
    } catch (error) {
      console.log("Error occer in updating profile : ", error);
      next(error);
    }
  },
];
