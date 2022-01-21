const User = require("../models/user");

exports.getMatches = async (req, res, next) => {
  try {
    const userId = req.query.userId;
    const matches = await User.find();
    const currentUser = [];
    let filteredMatches;
    let finalFilter = [];
    const leftPaneMatches = [];

    if (matches.length > 0) {
      filteredMatches = matches.filter((data) => {
        if (!(data._id.toString() === userId.toString())) {
          return data;
        } else {
          currentUser.push(data);
        }
      });
    }

    if (currentUser.length > 0) {
      if (
        currentUser[0].matches?.length > 0 ||
        currentUser[0].rejections?.length > 0
      ) {
        finalFilter = filteredMatches.filter((data) => {
          if (
            currentUser[0].rejections.indexOf(data._id.toString()) === -1 &&
            currentUser[0].matches.indexOf(data._id.toString()) === -1
          ) {
            return data;
          }
        });

        currentUser[0].matches?.forEach((matchId) => {
          matches.forEach((match) => {
            if (matchId.toString() === match._id.toString()) {
              leftPaneMatches.push({
                name: match.name,
                _id: match._id.toString(),
              });
            }
          });
        });
      } else {
        finalFilter = [...filteredMatches];
      }
    }

    console.log("Final Matches: " + finalFilter?.length);
    res.status(200).json({
      cardData: finalFilter,
      leftPane: leftPaneMatches,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.actionsMatchMaker = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const matchUserId = req.body.finalAction.matchUserId;
    const rejectUserId = req.body.finalAction.rejectUserId;
    const favoritesUserId = req.body.finalAction.favoriteUserId;
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User with this id cannot be found.");
      error.statusCode = 401;
      throw error;
    }

    if (matchUserId) {
      if (user.matches.indexOf(matchUserId) !== -1) {
        const error = new Error("Already matched");
        error.statusCode = 401;
        throw error;
      }

      user.matches.push(matchUserId);
      const result = await user.save();

      if (result) {
        res.json({ message: "Match added", action: "Reload" });
      }
    }

    if (rejectUserId) {
      if (user.rejections.indexOf(rejectUserId) !== -1) {
        const error = new Error("Reject added already");
        error.statusCode = 401;
        throw error;
      }

      user.rejections.push(rejectUserId);
      const result = await user.save();

      if (result) {
        res.json({ message: "Reject added", action: "Reload" });
      }
    }

    if (favoritesUserId) {
      if (user.favorites.indexOf(favoritesUserId) !== -1) {
        const error = new Error("Favorite added already");
        error.statusCode = 401;
        throw error;
      }

      user.favorites.push(favoritesUserId);
      const result = await user.save();

      if (result) {
        res.json({ message: "Favorite added" });
      }
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
