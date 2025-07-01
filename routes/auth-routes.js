const express = require("express");
const authController = require("../controller/auth-controller");

const authRoute = express.Router();

authRoute.get("/login", authController.getLogin);
authRoute.post("/login", authController.postLogin);
authRoute.post('/logout',authController.postLogOut)
authRoute.get("/signup", authController.getSignUp);
authRoute.post("/signup", authController.postSignUp);
exports.authRoute = authRoute