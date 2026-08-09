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

const updateProblem = async (req, res) => {

    try {
        const problem = await problemService.updateProblem(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Problem updated successfully",
            data: problem
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const deleteProblem = async (req, res) => {
    try{
        await problemService.deleteProblem(req.params.id);
        res.status(200).json({
            success: true,
            message: "Problem deleted successfully"
        });
    } catch (error){
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createProblem, getProblems, getProblemById, updateProblem, deleteProblem
};