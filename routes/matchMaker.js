const express = require("express");

const matchesController = require("../controller/matchMaker");

const router = express.Router();

const isAuth = require("../middleware/is-auth");

router.get("/matchmaker", isAuth, matchesController.getMatches);

router.put("/matchmaker/add-match", isAuth, matchesController.addMatch);

module.exports = router;
