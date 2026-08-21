const express = require("express");

const leaderboardController = require("../controllers/leaderboard.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/contests/:contestId/leaderboard", authMiddleware, leaderboardController.getContestLeaderboard);

module.exports = router;