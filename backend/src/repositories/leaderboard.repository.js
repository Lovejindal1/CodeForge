const Contest = require("../models/Contest");
const Submission = require("../models/Submission");

const findContestById = async (contestId) => {
    return await Contest.findById(contestId).populate("participants", "_id name");
}

const findContestSubmissions = async (problemIds, participantIds, startTime, endTime) => {
    return await Submission.find({
        problem: {$in: problemIds},
        user: {$in: participantIds},
        createdAt: {
            $gte: startTime,
            $lte: endTime
        }
    }).sort({ createdAt: 1 });
}

module.exports = {
    findContestById, findContestSubmissions
};