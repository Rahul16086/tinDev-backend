const express = require("express");

const profileController = require("../controller/profile");

const router = express.Router();

router.get("/:userId", profileController.getUserData);

router.put("/:userId/settingsUpdate", profileController.updateUserSetting);

router.put("/:userId/infoUpdate", profileController.updateUserInfo);

module.exports = router;
