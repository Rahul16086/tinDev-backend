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
