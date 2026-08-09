const problemService = require("../services/problem.service");

const createProblem = async (req, res) => {

    try {
        const problem = await problemService.createProblem(
            req.body,
            req.user.id
        );
        res.status(201).json({
            success: true,
            message: "Problem created successfully",
            data: problem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getProblems = async (req, res) => {
    try {
        const result = await problemService.getProblems(req.query);
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

const getProblemById = async (req, res) => {
    try {
        const problem = await problemService.getProblemById(req.params.id);
        res.status(200).json({
            success: true,
            data: problem
        });

    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createProblem, getProblems, getProblemById
};