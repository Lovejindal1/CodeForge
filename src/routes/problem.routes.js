const express = require("express");

const {authMiddleware, adminMiddleware} = require("../middlewares/auth.middleware");

const problemController = require("../controllers/problem.controller");

const router = express.Router();

// Create Problems by admin
router.post("/", authMiddleware, adminMiddleware, problemController.createProblem);

// Ftech all problems using filter
router.get("/", problemController.getProblems);

//Search problem by id
router.get("/:id", problemController.getProblemById);

//Update by admin
router.put("/:id", authMiddleware, adminMiddleware, problemController.updateProblem);

module.exports = router;