const Submission = require("../models/Submission");

const create = async (data) => {
    return await Submission.create(data);
}

const findById = async (id) => {
    return await Submission.findById(id).populate("problem", "problemNumber title difficulty").populate("user", "name email");
};

const findByUser = async (userId) => {
    return await Submission.find({
        user: userId
    }).populate("problem", "problemNumber title difficulty").sort({ createdAt: -1 });
};

const findByUserAndProblem = async (userId, problemId) => {
    return await Submission.find({
        user: userId,
        problem: problemId
    }).sort({ createdAt: -1 });
};

module.exports = {
    create, findById, findByUser, findByUserAndProblem
};