const { check, validationResult } = require("express-validator");
const ContactUs = require("../models/contactUs-model");

exports.getContactUs = (req, res, next) => {
  // console.log(req.body)
  res.render("store/contact-us", {
    pageTitle: "Contact Us",
    currentPage: "Contact Us",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
    email: req.session.user.email,
    oldInput: {},
    errorMsg: [],
  });
};

exports.postContactUs = [(req,res,next) =>{
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next()
},
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Please enter a name")
    .isLength({
      min: 2,
    })
    .withMessage("Name must be at least 2 characters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  check("subject").trim().notEmpty().withMessage("Please enter a subject"),

  check("message").trim().notEmpty().withMessage("Please enter a message"),

  (req,res,next) => {
    const { name, email, subject, message } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // console.log(message);
      return res.status(422).render("store/contact-us", {
        pageTitle: "Contact Us",
        currentPage: "Contact Us",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user, 
        errorMsg: errors.array().map((err) => err.msg),
        oldInput: {
          name,
          email,
          subject,
          message,
        },
      });
    }
    next();
  },
  (req, res, next) =>{
    const { name, email, subject, message } = req.body;
    const contactUs = new ContactUs({
      name,
      email,
      subject,
      message,
    });
    contactUs.save();
    res.redirect("/guest");
  }
];
