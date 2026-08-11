const submissionRepository = require("../repositories/submission.repository");
const problemRepository = require("../repositories/problem.repository");

const createSubmission = async (submissionData, userId) => {
    const problem = await problemRepository.findById(submissionData.problem);

    if(!problem){
        throw new Error("Problem not found");
    }

    const submission = await submissionRepository.create({
        user: userId,
        problem: submissionData.problem,
        language: submissionData.language,
        code: submissionData.code,
        status: "pending"
    });
    return submission;
};

const getSubmissionById = async (id) => {
    
    const submission = await submissionRepository.findById(id);
    if (!submission) throw new Error("Submission not found");

    return submission;
};

const getMySubmissions = async (userId) => {
    return await submissionRepository.findByUser(userId);
};


const getProblemSubmissions = async (userId, problemId) => {

    const problem = await problemRepository.findById(problemId);
    if (!problem) {
        throw new Error("Problem not found");
    }

    return await submissionRepository.findByUserAndProblem(userId, problemId);
};


module.exports = {
    createSubmission, getSubmissionById, getMySubmissions, getProblemSubmissions
};