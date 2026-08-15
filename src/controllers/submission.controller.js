const submissionService = require("../services/submission.service");
const judgeService = require("../services/judge.service");

const createSubmission = async (req, res) => {

    try {
        const submission = await submissionService.createSubmission(req.body, req.user.id);
        res.status(201).json({
            success: true,
            message: "Submission created successfully",
            data: submission
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
        const submission = await submissionService.getSubmissionById(req.params.id);
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
    
    try{
        const submissions = await submissionService.getMySubmissions(req.user.id);
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
        const submissions =await submissionService.getProblemSubmissions(req.user.id, req.params.problemId);
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
        const result = await judgeService.judgeSubmission(req.params.id);
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

module.exports = {
    createSubmission, getSubmissionById, getMySubmissions, getProblemSubmissions, judgeSubmission
};