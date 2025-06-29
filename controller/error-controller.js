exports.error404 = (req, res) => {
  // for error 404
  res.status(404).render('store/error-404',{pageTitle : 'Error : 404'});
}