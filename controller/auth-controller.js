const {
  check,validationResult
} = require("express-validator");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "Login",
    isLoggedIn: false
  });
};
exports.getSignUp = (req, res, next) => {
  res.render('auth/sign-up', {
    pageTitle: "Sign Up",
    currentPage: "Sign Up",
    isLoggedIn: false,
    errorMsg: [],
    oldInput: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      userType: ''
    }
  })
};
exports.postLogin = (req, res, next) => {
  // req.isLoggedIn = true;
  // res.cookie('isLoggedIn', true)
  req.session.isLoggedIn = true;
  res.redirect('/home-list')
};
exports.postSignUp = [

  check('firstName')
  .trim()
  .notEmpty()
  .withMessage('Please enter a first name')
  .isLength({
    min: 2
  })
  .withMessage('First name must be at least 2 characters long')
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage('First name can only contain letters and spaces'),

  check('lastName')
  .trim()
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage('Last name can only contain letters and spaces'),

  check('email')
  .isEmail()
  .withMessage('Please enter a valid email')
  .normalizeEmail(),

  check('password')
  .trim()
  .notEmpty()
  .withMessage('Please enter a password')
  .isLength({
    min: 8
  })
  .withMessage('Password must be at least 8 characters long')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
  .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

  check('confirmPassword')
  .trim()
  .notEmpty()
  .withMessage('Please enter a confirm password')
  .custom((value, {
    req
  }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),

  check('userType')
  .notEmpty()
  .withMessage('Please select a user type')
  .isIn(['guest', 'host'])
  .withMessage('Invalid user type'),

  check('terms')
  .notEmpty()
  .withMessage('Please accept the terms and conditions')
  .custom((value) => {
    if (value !== 'on') {
      throw new Error('Please accept the terms and conditions');
    }
    return true;
  }),

  (req, res, next) => {
    // console.log(req.body)
    const {
      firstName,
      lastName,
      email,
      password,
      userType
    } = req.body;
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).render('auth/sign-up', {
        pageTitle: 'Sign Up',
        currentPage: 'Sign Up',
        isLoggedIn: false,
        errorMsg: error.array().map(err => err.msg),
        oldInput: {
          firstName,
          lastName,
          email,
          password,
          userType
        }
      })
    }
    res.redirect('/login')
  }
]
exports.postLogOut = (req, res, next) => {
  // req.isLoggedIn = true;
  // res.cookie('isLoggedIn',false);
  req.session.destroy(() => {
    res.redirect('/login')
  })

};