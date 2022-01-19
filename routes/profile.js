const express = require("express");

const profileController = require("../controller/profile");

const router = express.Router();

const isAuth = require("../middleware/is-auth");

router.get("/:userId", isAuth, profileController.getUserData);

router.put(
  "/:userId/settingsUpdate",
  isAuth,
  profileController.updateUserSetting
);

router.put("/:userId/infoUpdate", isAuth, profileController.updateUserInfo);

module.exports = router;
