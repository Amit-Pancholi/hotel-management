const express = require("express");
const profileRoute = express.Router();
const profileController = require("../controller/profile-controller");
const { upload } = require("../controller/uploadController");

profileRoute.get("/", profileController.getProfile);
profileRoute.get("/edit", profileController.getProfileEdit);
profileRoute.post(
  "/edit",
  upload.single("profileImage"),
  profileController.postProfileEdit
);

module.exports = profileRoute;
