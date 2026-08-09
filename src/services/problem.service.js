const problemRepository = require("../repositories/problem.repository");

const createProblem = async (problemData, userId) => {
    
    const problem = await problemRepository.create({...problemData, createdBy: userId });

    return problem;
}

const getProblems = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page-1)*limit;

    const filter = {};

    // Difficult filter
    if(query.difficulty){
        filter.difficulty = query.difficulty;
    }
    // Tag filter
    if(query.tag){
        filter.tags = query.tag;
    }
    // Problem Number filter
    if(query.problemNumber){
        filter.problemNumber = Number(query.problemNumber);
    }
    // Title search
    if(query.search){
        filter.title = {
            $regex: query.search,
            $options: "i"
        }
    }

    const [problems, total] = await Promise.all([
        problemRepository.findAll(filter, skip, limit),
        problemRepository.count(filter)
    ])

    return{
        problems, pagination: {page, limit, total, totalPages: Math.ceil(total / limit)}
    };
}

const updateProblem = async (id, data) => {
    const problem = await problemRepository.updateById(id, data);
    if(!problem)  throw new Error("Problem not found");
    return problem;
};

const getProblemById = async (id) => {
    const problem = await problemRepository.findById(id);
    if(!problem){
        throw new Error("Problem not found");
    }
    return problem;
};

const deleteProblem = async (id) => {
    const problem = await problemRepository.deleteById(id);
    if(!problem){
        throw new Error("Problem not found");
    }
    return problem;
};

module.exports = {
    createProblem, getProblems, getProblemById, updateProblem, deleteProblem
}