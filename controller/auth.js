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
    const location = req.body.location;
    const remoteAvailability = req.body.remoteAvailability;
    const lookingFor = req.body.lookingFor;
    const ageGroup = req.body.ageGroup;
    const experienceLevel = req.body.experienceLevel;
    const matchRadius = req.body.matchRadius;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name: name,
      email: email,
      phoneNumber: phone,
      password: hashedPassword,
      // location: location,
      age: age,
      // remoteAvailability: remoteAvailability,
      // lookingFor: lookingFor,
      // ageGroup: ageGroup,
      // experienceLevel: experienceLevel,
      // matchRadius: matchRadius,
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

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  let loadedUser;

  try {
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
      "secret",
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
