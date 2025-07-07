const { check, validationResult } = require("express-validator");
const User = require("../models/user-model");

const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "Login",
    isLoggedIn: false,
    errorMsg: [],
    oldInput: {
      email: "",
    },
    user: {},
  });
};
exports.getSignUp = (req, res, next) => {
  res.render("auth/sign-up", {
    pageTitle: "Sign Up",
    currentPage: "Sign Up",
    isLoggedIn: false,
    errorMsg: [],
    oldInput: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      userType: "",
    },
    user: {},
  });
};
exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email: email,
  });
  if (!user) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "Login",
      isLoggedIn: false,
      errorMsg: "Invalid email or password",
      oldInput: {
        email: email,
      },
      user: {},
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "Login",
      isLoggedIn: false,
      errorMsg: "Invalid password",
      oldInput: {
        email: email,
      },
      user: {},
    });
  }
  // req.isLoggedIn = true;
  // res.cookie('isLoggedIn', true)
  req.session.isLoggedIn = true;
  req.session.user = user;
  console.log(req.session.user);
  await req.session.save();
  if (user.userType === "guest") {
    return res.redirect("/guest/home-list");
  } else {
    return res.redirect("/host/home-list");
  }
};
exports.postSignUp = [
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

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  check("password")
    .trim()
    .notEmpty()
    .withMessage("Please enter a password")
    .isLength({
      min: 8,
    })
    .withMessage("Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  check("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Please enter a confirm password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  check("userType")
    .notEmpty()
    .withMessage("Please select a user type")
    .isIn(["guest", "host"])
    .withMessage("Invalid user type"),

  check("terms")
    .notEmpty()
    .withMessage("Please accept the terms and conditions")
    .custom((value) => {
      if (value !== "on") {
        throw new Error("Please accept the terms and conditions");
      }
      return true;
    }),

  (req, res, next) => {
    // console.log(req.body)
    const { firstName, lastName, email, password, userType } = req.body;
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).render("auth/sign-up", {
        pageTitle: "Sign Up",
        currentPage: "Sign Up",
        isLoggedIn: false,
        errorMsg: error.array().map((err) => err.msg),
        oldInput: {
          firstName,
          lastName,
          email,
          password,
          userType,
        },
        user: {},
      });
    }
    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          userType,
        });
        return user.save();
      })
      .then((result) => {
        res.redirect("/login");
      })
      .catch((err) => {
        // console.log(err.message);
        if (err.code === 11000 && err.keyValue && err.keyValue.email) {
          err.message = "Email already exists";
          return res.status(422).render("auth/sign-up", {
            pageTitle: "Sign Up",
            currentPage: "Sign Up",
            isLoggedIn: false,
            errorMsg: err.message,
            oldInput: {
              firstName,
              lastName,
              email,
              password,
              userType,
            },
            user: {},
          });
        } else {
          return res.status(422).render("auth/sign-up", {
            pageTitle: "Sign Up",
            currentPage: "Sign Up",
            isLoggedIn: false,
            errorMsg: err.message,
            oldInput: {
              firstName,
              lastName,
              email,
              password,
              userType,
            },
            user: {},
          });
        }
      });
  },
];
exports.postLogOut = (req, res, next) => {
  // req.isLoggedIn = true;
  // res.cookie('isLoggedIn',false);
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
