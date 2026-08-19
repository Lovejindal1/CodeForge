const Contest = require("../models/Contest");

const createContest = async (contestData) =>{
    return await Contest.create(contestData);
}

const findAllContests = async () => {
    return await Contest.find()
                .populate("createdBy", "name email")
                .populate("problems", "problemNumber title difficulty")
                .populate("participants", "name email");
}

const findContestById = async (contestId) => {
    return await Contest.findById(contestId)
                .populate("createdBy", "name email")
                .populate("problems", "problemNumber title difficulty")
                .populate("participants", "name email");
}

const findContestByIdWithoutPopulate = async (contestId) => {
    return await Contest.findById(contestId);
}

const addParticipant = async (contestId, userId) => {
    return await Contest.findByIdAndUpdate(contestId, {
            $addToSet: {
                participants: userId
            }
        }, {new: true}
    );
}

const isParticipant = async (contestId, userId) => {
    return await Contest.exists({
        _id: contestId,
        participants: userId
    });
}

module.exports = {
    createContest, findAllContests, findContestById, findContestByIdWithoutPopulate, addParticipant, isParticipant
};