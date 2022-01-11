const express = require("express");

const profileController = require("../controller/profile");

const router = express.Router();

router.get("/:userId", profileController.getUserData);

module.exports = router;
