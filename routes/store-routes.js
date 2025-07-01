const express = require("express");
const storeController = require("../controller/store-controller");
const storeRoute = express.Router();

storeRoute.get("/", storeController.getIndex);
storeRoute.get("/contact-us", storeController.getContactUs);
storeRoute.get("/home-list", storeController.getHome);
storeRoute.get("/home-details/:homeId", storeController.getDetails);
// storeRoute.get("/home-booking", storeController.getBooking);
storeRoute.get("/favourites", storeController.getFavourite);
storeRoute.post("/favourites", storeController.postAddToFavourite);
storeRoute.post("/favourites-remove/:homeId", storeController.postRemoveToFavourite);
// storeRoute.get("/contact-us", storeController.getContactUs);

module.exports = storeRoute;
