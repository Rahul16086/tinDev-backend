const express = require("express");

const matchesController = require("../controller/matchMaker");

const router = express.Router();

router.get("/matchmaker", matchesController.getMatches);

router.put("/matchmaker/add-match", matchesController.addMatch);

module.exports = router;
