const express = require("express");
const authController = require("./../controllers/authController");
const router = express.Router();

// @desc Signup user
//@route POST "/api/v1/users/signup"
router.post("/signup", authController.signup);

// @desc Account activation
//@route POST "/api/v1/users/account-activation"
router.post("/account-activation", authController.accountActivation);

// @desc Sign in a user
//@route POST "/api/v1/users/signin"
router.post("/signin", authController.signin);

module.exports = router;
