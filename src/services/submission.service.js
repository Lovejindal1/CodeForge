const submissionRepository = require("../repositories/submission.repository");
const problemRepository = require("../repositories/problem.repository");

const createSubmission = async (submissionData, userId) => {

    const problem = await problemRepository.findById(submissionData.problem);

    if(!problem){
        throw new Error("Problem not found");
    }

    if (submissionData.language !== "cpp") {
        throw new Error("Only C++ is supported currently");
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

const getSubmissionById = async (id, userId) => {
    
    const submission = await submissionRepository.findById(id);
    if (!submission) throw new Error("Submission not found");

    if (submission.user._id.toString() !== userId.toString()) {
        throw new Error("You are not allowed to access this submission");
    }

    return submission;
};

const getMySubmissions = async (userId, query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
        submissionRepository.findByUser(userId, skip, limit),
        submissionRepository.countByUser(userId)
    ]);

    return {
        submissions,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};


const getProblemSubmissions = async (userId, problemId, query) => {

    const problem = await problemRepository.findById(problemId);

    if (!problem) {
        throw new Error("Problem not found");
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
        submissionRepository.findByUserAndProblem(userId, problemId, skip, limit),
        submissionRepository.countByUserAndProblem( userId, problemId)
    ]);

    return {
        submissions, pagination: { page, limit, total, totalPages: Math.ceil(total / limit)}
    };
};


module.exports = {
    createSubmission, getSubmissionById, getMySubmissions, getProblemSubmissions
};