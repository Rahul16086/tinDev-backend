const express = require("express");

const matchesController = require("../controller/matchMaker");

const router = express.Router();

router.get("/profile", matchesController.getMatches);

module.exports = router;