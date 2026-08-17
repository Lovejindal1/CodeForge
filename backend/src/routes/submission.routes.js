const express = require("express");

const {authMiddleware} = require("../middlewares/auth.middleware");
const submissionController = require("../controllers/submission.controller");

const router = express.Router();

router.post("/", authMiddleware, submissionController.createSubmission);

router.post("/run", authMiddleware, submissionController.runCode);

router.get("/my/stats", authMiddleware, submissionController.getMyStats);

router.get("/my", authMiddleware, submissionController.getMySubmissions);

router.get("/problem/:problemId", authMiddleware, submissionController.getProblemSubmissions);

router.get("/:id", authMiddleware, submissionController.getSubmissionById);

router.post("/:id/judge", authMiddleware, submissionController.judgeSubmission);

module.exports = router;