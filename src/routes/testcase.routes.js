const express = require("express");

const {authMiddleware} = require("../middlewares/auth.middleware");
const testcaseController = require("../controllers/testcase.controller");

const router = express.Router();

router.post("/", authMiddleware,testcaseController.createTestCase);
router.get("/problem/:problemId", authMiddleware, testcaseController.getTestCasesbyProblem);
router.delete("/:id", authMiddleware, testcaseController.deleteTestCase);

module.exports = router;