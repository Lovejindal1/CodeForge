const express = require("express");

const {authMiddleware, adminMiddleware} = require("../middlewares/auth.middleware");

const problemController = require("../controllers/problem.controller");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, problemController.createProblem);

router.get("/", problemController.getProblems);

router.get("/:id", problemController.getProblemById);

module.exports = router;