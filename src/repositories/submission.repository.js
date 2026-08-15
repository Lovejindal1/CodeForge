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

const findByUser = async (userId, skip, limit) => {
    return await Submission.find({
        user: userId
    })
        .populate("problem", "problemNumber title difficulty")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
};

const countByUser = async (userId) => {
    return await Submission.countDocuments({
        user: userId
    });
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

module.exports = {
    create, findById, updateById, findByUser, findByUserAndProblem, countByUser, countByUserAndProblem
};