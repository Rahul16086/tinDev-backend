const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const User = require("../models/user");
const authController = require("../controller/auth");

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid E-Mail")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 6 }),
    body("name").trim().not().isEmpty(),
  ],
  authController.signup
);

router.put("/signupTwo", authController.signupTwo);

router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").trim().isLength({ min: 6 }).not().isEmpty(),
  ],
  authController.login
);

router.post("/forgotPassword", authController.forgetPassword);

router.put("/resetPassword/:resetToken", authController.resetPassword);

router.get("/verifyToken", authController.getVerification);

module.exports = router;
