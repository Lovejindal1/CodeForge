const testcaseService = require("../services/testcase.service");

const createTestCase = async (req,res) => {
    try {
        const testCase = await testcaseService.createTestCase(req.body, req.user.id);
        res.status(201).json({
            success: true,
            message: "Test case created successfully",
            data: testCase
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getTestCasesbyProblem = async (req,res) => {
    try {
        const testCases = await testcaseService.getTestCasesbyProblem(req.params.problemId);
        res.status(200).json({
            success: true,
            data: testCases
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteTestCase  = async (req, res) => {
    try {
        const testCase = await testcaseService.deleteTestCase(req.params.id);
        res.status(200).json({
            success: true,
            message: "Test case deleted successfully",
            data: testCase
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createTestCase, getTestCasesbyProblem, deleteTestCase
}