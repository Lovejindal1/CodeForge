const contestService = require("../services/contest.service");

const createContest = async (req, res) => {
    try {
        const contest = await contestService.createContest(req.body, req.user.id);
        return res.status(201).json({
            success: true,
            message: "Contest created successfully",
            data: contest
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

const getAllContests = async (req, res) => {
    try {
        const contests = await contestService.getAllContests();
        return res.status(200).json({
            success: true,
            data: contests
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

const getContestById = async (req, res) => {
    try {
        const contest = await contestService.getContestById(req.params.contestId);
        return res.status(200).json({
            success: true,
            data: contest
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

const joinContest = async (req, res) => {
    try {
        const contest = await contestService.joinContest(req.params.contestId, req.user.id);
        return res.status(200).json({
            success: true,
            message: "Contest joined successfully",
            data: contest
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

const getContestStatus = async (req, res) => {
    try {
        const status = await contestService.getContestStatus(req.params.contestId);
        return res.status(200).json({
            success: true,
            data: status
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

const getContestProblems = async (req, res) => {
    try {
        const problems = await contestService.getContestProblems(req.params.contestId, req.user.id);
        return res.status(200).json({
            success: true,
            data: problems
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

module.exports = {
    createContest, getAllContests, getContestById, joinContest, getContestStatus, getContestProblems
};