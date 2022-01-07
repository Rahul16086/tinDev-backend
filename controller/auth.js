const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name: name,
      email: email,
      phoneNumber: phone,
      password: hashedPassword,
      age: age,
    });

    const saved = await user.save();
    if (saved) {
      res.status(201).json({ message: "User created", userId: saved._id });
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
    const remoteAvailability = req.body.remoteAvailability;
    const lookingFor = req.body.lookingFor;
    const experienceLevel = req.body.experienceLevel;
    const matchRadius = req.body.matchRadius;
    const github = req.body.github;
    const portfolio = req.body.portfolio;
    const linkedIn = req.body.linkedIn;
    const summary = req.body.summary;
    const userId = req.body.userId;

    const user = await User.findById(userId);

    console.log("⚡: ", user);
    if (!user) {
      const error = new Error("User with this User-ID cannot be found.");
      error.statusCode = 401;
      throw error;
    }
    user.location = location;
    user.remoteAvailability = remoteAvailability;
    user.lookingFor = lookingFor;
    user.experienceLevel = experienceLevel;
    user.matchRadius = matchRadius;
    user.links = {
      github: github,
      portfolio: portfolio,
      linkedIn: linkedIn,
    };
    user.summary = summary;

    const result = await user.save();

    if (result) {
      console.log("Details updated!!");
      res.json({ message: "Details of the user updated" });
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
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token, userId: loadedUser._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
