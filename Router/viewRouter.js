const express = require("express");
const { showform, login, profile, forgotPassword, resetPassword } = require("../Controller/viewController.js");
const { isLoggedin, forgetPassword } = require("./../controller/authcontroller");
const viewRouter = express.Router();
viewRouter.get("/addagent", showform);
///api/addagent
viewRouter.get("/login", login);
viewRouter.get("/profile", isLoggedin, profile);
viewRouter.get("/forgotPassword", forgotPassword);
viewRouter.get('/resetPassword', resetPassword)
module.exports = viewRouter;
