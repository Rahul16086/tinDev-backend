const User = require("../models/user");

exports.getMatches = async (req, res, next) => {
  try {
    const matches = await User.find();
    res.status(200).json({ matches: matches });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addMatch = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const matchUserId = req.body.matchUserId;
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User with this id cannot be found.");
      error.statusCode = 401;
      throw error;
    }

    if (user.matches.indexOf(matchUserId) !== -1) {
      const error = new Error("Already matched");
      error.statusCode = 401;
      throw error;
    }

    user.matches.push(matchUserId);
    const result = await user.save();

    if (result) {
      console.log("Matches updated!!");
      res.json({ message: "Match added" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
