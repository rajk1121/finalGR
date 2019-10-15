const express = require('express');
const fs = require('fs');
var { getuser, postuser, deleteuser, resetpass } = require('./../controller/userController.js');
var { signup, login, forgetPassword, resetPassword, logout } = require('./../controller/authcontroller');
let userRouter = express.Router();
userRouter.route('/')
    .get(getuser);
// .post(postuser);
userRouter.route('/signup').post(signup);
userRouter.route('/login').post(login);
userRouter.route('/logout').get(logout);
userRouter.route('/forgetPassword').post(forgetPassword);
userRouter.route('/resetPassword').patch(resetPassword);
module.exports = userRouter;