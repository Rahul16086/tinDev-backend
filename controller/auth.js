const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

const tokenGenerator = (email, userId) => {
  return jwt.sign(
    {
      email: email,
      userId: userId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const hashedPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};
exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const email = req.body.email;
    const phone = req.body.phoneNumber;
    const password = req.body.password;
    const name = req.body.name;
    const age = req.body.age;
    const passwordFinal = await hashedPassword(password);
    const user = new User({
      name: name,
      email: email,
      phoneNumber: phone,
      password: passwordFinal,
      age: age,
    });

    const saved = await user.save();
    if (saved) {
      const token = tokenGenerator(saved.email, saved._id.toString());
      res
        .status(201)
        .json({ message: "User created", userId: saved._id, token: token });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.signupTwo = async (req, res, next) => {
  try {
    const location = req.body.location;
    const designation = req.body.designation;
    const experience = req.body.experience;
    const remoteAvailability = req.body.remoteAvailability;
    const lookingFor = req.body.lookingFor;
    const experienceLevel = req.body.experienceLevel;
    const matchRadius = req.body.matchRadius;
    const github = req.body.github;
    const portfolio = req.body.portfolio;
    const linkedIn = req.body.linkedIn;
    const skills = req.body.skills;
    const summary = req.body.summary;
    const userId = req.body.userId;

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User with this User-ID cannot be found.");
      error.statusCode = 401;
      throw error;
    }
    user.location = location;
    user.designation = designation;
    user.experience = experience;
    user.links = {
      github: github,
      portfolio: portfolio,
      linkedIn: linkedIn,
    };
    user.skills.push(skills.split(",").map((skill) => skill.trim()));
    user.summary = summary;
    user.lookingFor = lookingFor;
    user.remoteAvailability = remoteAvailability;
    user.experienceLevel = experienceLevel;
    user.matchRadius = matchRadius;

    const result = await user.save();

    if (result) {
      console.log("Details updated!!");
      res.status(200).json({ message: "Details of the user updated" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  let loadedUser;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User with this E-Mail cannot be found.");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Invalid Password");
      error.statusCode = 401;
      throw error;
    }

    const token = tokenGenerator(loadedUser.email, loadedUser._id.toString());
    const verification = verifyToken(token);
    if (verification) {
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.forgetPassword = async (req, res, next) => {
  const email = req.body.email;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("Invalid E-Mail");
      error.statusCode(401);
      throw error;
    }

    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

    const message = `<h1>Password Reset has been requested</h1>
                         <p>Please click the link inorder to reset your password</p>
                         <a href=${resetUrl}>${resetUrl}</a>`;
    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      res.status(200).json({ message: "Email sent" });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      const error = new Error("Email could not be sent!");
      error.statusCode(500);
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  const paramsToken = req.params.resetToken;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(paramsToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      const error = new Error("Invalid Reset Token");
      error.statusCode(400);
      throw error;
    }

    user.password = await hashedPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({ message: "Password reset successful" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
