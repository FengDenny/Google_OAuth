const express = require("express");
const userController = require("./../controllers/userController");
const { requiredSignIn, admin } = require("./../controllers/authController");

const router = express.Router();

// @desc   users to their correct profile page
//@route GET  /api/v1/user/:id
router.get("/:id", requiredSignIn, userController.read);

// @desc  Update users profile as admin
//@route PUT  /api/v1/user/update
router.put("/update", requiredSignIn, userController.update);
router.put("/admin/update", requiredSignIn, admin, userController.update);

module.exports = router;
