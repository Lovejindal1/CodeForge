const Submission = require("../models/Submission");

const create = async (data) => {
    return await Submission.create(data);
}

const findById = async (id) => {
    return await Submission.findById(id).populate("problem", "problemNumber title difficulty").populate("user", "name email");
};

const updateById = async (id, data) => {
    return await Submission.findByIdAndUpdate(id, data, { new: true });
};

const findByFilter = async (filter, skip, limit) => {
    return await Submission.find(filter)
        .populate("problem", "problemNumber title difficulty")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
};

const countByFilter = async (filter) => {
    return await Submission.countDocuments(filter);
};

const findByUserAndProblem = async (userId, problemId,  skip, limit) => {
    return await Submission.find({
        user: userId,
        problem: problemId
    }).populate("problem", "problemNumber title difficulty").sort({ createdAt: -1 }).skip(skip).limit(limit);;
};

const countByUserAndProblem = async (userId, problemId) => {
    return await Submission.countDocuments({
        user: userId,
        problem: problemId
    });
};

const countByUser = async (userId) => {
    return await Submission.countDocuments({
        user: userId
    });
};

const countByUserAndStatus = async (userId, status) => {
    return await Submission.countDocuments({
        user: userId,
        status
    });
};

const countSolvedProblems = async (userId) => {
    const problems = await Submission.distinct("problem", {
        user: userId,
        status: "accepted"
    });

    return problems.length;
};

const findRecentByUser = async (userId, limit = 5) => {
    return await Submission.find({
        user: userId
    })
        .populate("problem", "problemNumber title difficulty")
        .sort({ createdAt: -1 })
        .limit(limit);
};

const findSolvedProblemIdsByUser = async (userId) => {
    return await Submission.distinct("problem", {
        user: userId,
        status: "accepted"
    });
};

module.exports = {
    create, findById, updateById, findByUserAndProblem, countByUserAndProblem, findByFilter, countByFilter, countByUserAndStatus, countSolvedProblems, findRecentByUser, countByUser, findSolvedProblemIdsByUser
};