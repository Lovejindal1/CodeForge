const submissionService = require("../services/submission.service");
const judgeService = require("../services/judge.service");

const createSubmission = async (req, res) => {

    try {

        const submission = await submissionService.createSubmission(req.body, req.user.id);

        const result = await judgeService.judgeSubmission( submission._id, req.user.id );

        res.status(201).json({
            success: true,
            message: "Submission judged successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getSubmissionById = async (req, res) => {

    try {
        const submission = await submissionService.getSubmissionById(req.params.id, req.user.id);
        res.status(200).json({
            success: true,
            data: submission
        });
    } catch(error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const getMySubmissions = async (req, res) => {
    try {
        const submissions = await submissionService.getMySubmissions(
            req.user.id,
            req.query
        );

        res.status(200).json({
            success: true,
            data: submissions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getProblemSubmissions = async (req, res) => {
    
    try {
        const submissions =await submissionService.getProblemSubmissions(req.user.id, req.params.problemId, req.query);
        res.status(200).json({
            success: true,
            data: submissions
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const judgeSubmission = async (req, res) => {
    try {
        const submission = await submissionService.getSubmissionById(req.params.id, req.user.id);

        const result = await judgeService.judgeSubmission(submission._id, req.user.id);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMyStats = async (req, res) => {
    try {
        const stats = await submissionService.getMyStats(req.user.id);
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const runCode = async (req, res) => {
    try {
        const { problem, language = "cpp", code } = req.body;
        if (!problem) {
            return res.status(400).json({
                success: false,
                message: "Problem ID is required"
            });
        }
        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Code is required"
            });
        }

        const result = await judgeService.runCode(problem, language, code);

        res.status(200).json({
            success: true,
            message: "Code executed successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createSubmission, getSubmissionById, getMySubmissions, getProblemSubmissions, judgeSubmission, getMyStats, runCode
};