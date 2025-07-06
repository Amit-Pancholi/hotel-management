const express = require("express");
const contactUsController = require("../controller/contactUs-controller");
const contactUsRoute = express.Router();

contactUsRoute.get("/contact-us", contactUsController.getContactUs);
contactUsRoute.post("/contact-us",contactUsController.postContactUs);

module.exports = contactUsRoute;