const express = require("express");

const contestController = require("../controllers/contest.controller");

const {authMiddleware, adminMiddleware} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, contestController.createContest);

router.get("/", contestController.getAllContests);

router.get("/:contestId", contestController.getContestById);

router.post("/:contestId/join", authMiddleware, contestController.joinContest);

router.get("/:contestId/status", authMiddleware, contestController.getContestStatus);

router.get("/:contestId/problems", authMiddleware, contestController.getContestProblems);

module.exports = router;