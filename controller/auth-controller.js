exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Home Reg",
    currentPage: "Login",
    isLoggedIn: false
  });
};

exports.postLogin = (req, res, next) => {
  // req.isLoggedIn = true;
  // res.cookie('isLoggedIn', true)
  req.session.isLoggedIn = true;
  res.redirect('/home-list')
};
exports.postLogOut = (req, res, next) => {
  // req.isLoggedIn = true;
  // res.cookie('isLoggedIn',false);
  req.session.destroy(() => {
    res.redirect('/login')
  })

};