const User = require("../models/user");

exports.getUserData = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    const allUsers = await User.find();
    const favorites = [];
    let skills = [];

    if (user) {
      user.favorites?.forEach((matchId) => {
        allUsers?.forEach((user) => {
          if (matchId.toString() === user._id.toString()) {
            favorites.push({
              name: user.name,
              _id: user._id.toString(),
            });
          }
        });
      });
      if (user.skills[0].length > 6) {
        user.skills[0] = user.skills[0].splice(0, 6);
      } else {
        skills = [...user.skills[0]];
      }
      res.json({ user: user, favorites: favorites, skills: skills });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateUserSetting = async (req, res, next) => {
  const userId = req.params.userId;
  const email = req.body.email.trim();
  const phone = req.body.phoneNumber;
  const location = req.body.location;
  const remoteAvailability = req.body.remoteAvailability;
  const lookingFor = req.body.lookingFor;
  const experienceLevel = req.body.experienceLevel;
  const matchRadius = req.body.matchRadius;

  try {
    const user = await User.findById(userId);
    if (user) {
      user.email = email;
      user.phoneNumber = phone;
      user.location = location;
      user.remoteAvailability = remoteAvailability;
      user.lookingFor = lookingFor;
      user.experienceLevel = experienceLevel;
      user.matchRadius = matchRadius;

      const result = await user.save();
      if (result._id.toString() === userId) {
        console.log(result);
        res.status(200).json({ message: "Updated Successfully!" });
      }
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateUserInfo = async (req, res, next) => {
  const userId = req.params.userId;
  const name = req.body.name;
  const designation = req.body.designation;
  const experience = req.body.experience;
  const github = req.body.github;
  const portfolio = req.body.portfolio;
  const linkedIn = req.body.linkedIn;
  const skills = req.body.skills;
  const summary = req.body.summary;

  try {
    const user = await User.findById(userId);
    if (user) {
      user.name = name;
      user.designation = designation;
      user.experience = experience;
      user.links.github = github;
      user.links.portfolio = portfolio;
      user.links.linkedIn = linkedIn;
      if (user.skills.length > 0) {
        user.skills.pop();
        user.skills.push(skills.split(",").map((skill) => skill.trim()));
      } else {
        user.skills.push(skills.split(",").map((skill) => skill.trim()));
      }
      user.summary = summary;
      const result = await user.save();
      if (result._id.toString() === userId) {
        res.status(200).json({ message: "Updated Info Successfully!" });
      }
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
