const contestRepository = require("../repositories/contest.repository");
const problemRepository = require("../repositories/problem.repository");
const ApiError = require("../utils/ApiError");

const createContest = async (contestData, userId) => {
    const {title, description, startTime, endTime, problems} = contestData;
    if(!title || !description || !startTime || !endTime || !problems){
        throw new ApiError(400, "All contest field are required")
    }
    if (!Array.isArray(problems) || problems.length === 0) {
        throw new ApiError(400, "Contest must contain at least one problem");
    }
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new ApiError(400, "Invalid startTime or endTime");
    }
    if (end <= start) {
        throw new ApiError(400, "endTime must be after startTime");
    }

    if (start <= new Date()) {
        throw new ApiError(400, "Contest startTime must be in the future");
    }
    const uniqueProblems = [...new Set(problems.map(String))];
    if (uniqueProblems.length !== problems.length) {
        throw new ApiError(400, "Duplicate problems are not allowed");
    }
    for (const problemId of uniqueProblems) {
        const problem = await problemRepository.findById(problemId);
        if (!problem) {
            throw new ApiError(
                404,
                `Problem not found: ${problemId}`
            );
        }
    }
    const contest = await contestRepository.createContest({
        title, description, startTime: start, endTime: end, problems: uniqueProblems, participants: [], createdBy: userId
    });

    return contest;
}

const getAllContests = async () => {
    return await contestRepository.findAllContests();
}

const getContestById = async (contestId) => {
    const contest =  await contestRepository.findContestById(contestId);
    if(!contest) throw new ApiError(404, "Contest not found");

    const now = new Date();
    const contestData = contest.toObject();
    if (now < contest.startTime)  contestData.problems = [];

    return contestData;
}

const joinContest = async (contestId, userId) => {
    const contest = await contestRepository.findContestByIdWithoutPopulate(contestId);
    if(!contest){
        throw new ApiError(404, "Contest not found");
    }

    const now = new Date();
    if (now >= contest.endTime) {
        throw new ApiError(400, "Contest has already ended");
    }

    const alreadyParticipant = await contestRepository.isParticipant(contestId, userId);
    if (alreadyParticipant) {
        throw new ApiError(400, "You have already joined this contest");
    }

    const updatedContest = await contestRepository.addParticipant(contestId, userId);

    return updatedContest;
}

const getContestStatus = async (contestId) => {
    const contest = await contestRepository.findContestByIdWithoutPopulate(contestId);
    if(!contest) throw new ApiError(404, "Contest now found");

    const now = new Date();
    let status;

    if(now<contest.startTime) {
        status = "upcoming";
    } else if(now>=contest.startTime && now<contest.endTime){
        status = "running";
    } else {
        status = "ended";
    }

    return {
        contestId: contest._id, status, startTime: contest.startTime, endTime: contest.endTime
    }
}

const getContestProblems = async (contestId, userId) => {

    const contest = await contestRepository.findContestByIdWithoutPopulate(contestId);
    if (!contest) {
        throw new ApiError(404, "Contest not found");
    }

    const participant = await contestRepository.isParticipant(contestId, userId);
    if (!participant) {
        throw new ApiError(403, "You must join the contest first");
    }

    const now = new Date();
    if (now < contest.startTime) {
        throw new ApiError(403, "Contest has not started yet");
    }

    return contest.problems;
};

module.exports = {
    createContest, getAllContests, getContestById, joinContest, getContestStatus, getContestProblems
};