const express = require("express");

const {authMiddleware, adminMiddleware} = require("../middlewares/auth.middleware");
const testcaseController = require("../controllers/testcase.controller");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, testcaseController.createTestCase);
router.get("/problem/:problemId", authMiddleware, testcaseController.getTestCasesbyProblem);
router.delete("/:id", authMiddleware, adminMiddleware, testcaseController.deleteTestCase);

module.exports = router;