const express = require("express");
const hostController = require("../controller/host-controller");

const hostRoute = express.Router();

hostRoute.get("/home-add", hostController.getHomeAdd);
hostRoute.get('/edit-home/:homeId',hostController.getEditHome)
hostRoute.post("/edit-home", hostController.postEditHome);
hostRoute.get("/home-list",hostController.getHostHomeList)
hostRoute.post("/home-list",hostController.postHomeAdd)
hostRoute.post("/remove-home/:homeId",hostController.postRemoveHome)
exports.hostRoute = hostRoute;
