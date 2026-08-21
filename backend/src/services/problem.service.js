const problemRepository = require("../repositories/problem.repository");
const {getCache, setCache, deleteCache, deleteCachePattern} = require("../utils/cache");
const createProblem = async (problemData, userId) => {
    const problem = await problemRepository.create({...problemData, createdBy: userId });

    await deleteCachePattern("problems:*");

    console.log("Problem list cache invalidated");
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

    // Create unique cache key based on query
    const cacheKey = `problems:${page}:${limit}:${query.difficulty || "all"}:${query.tag || "all"}:${query.problemNumber || "all"}:${query.search || "all"}`;

    // 1. Check Redis
    const cachedProblems = await getCache(cacheKey);
    if (cachedProblems) {
        console.log("Problems Cache HIT:", cacheKey);
        return cachedProblems;
    }

    console.log("Problems Cache MISS:", cacheKey);
    // 2. Get data from MongoDB
    const [problems, total] = await Promise.all([
        problemRepository.findAll(filter, skip, limit),
        problemRepository.count(filter)
    ]);

    const result = {
        problems, pagination: {page, limit, total, totalPages: Math.ceil(total / limit)}
    };
    // 3. Save result in Redis
    await setCache(cacheKey, result, 300);
    console.log("Problems cached:", cacheKey);

    return result;
}

const updateProblem = async (id, data) => {
    const problem = await problemRepository.updateById(id, data);
    if(!problem)  throw new Error("Problem not found");

    const cacheKey = `problem:${id}`;
    await deleteCache(cacheKey);
    console.log("Problem cache invalidated:", cacheKey);

    // Delete all problem-list caches
    await deleteCachePattern("problems:*");

    console.log("Problem list cache invalidated");

    return problem;
};

const getProblemById = async (id) => {
    const cacheKey = `problem:${id}`;

    //1. check redis
    const cachedProblem = await getCache(cacheKey);
    if(cachedProblem){
        console.log("Redis Cache HIT: ", cacheKey);
        return cachedProblem;
    }

    console.log("Redis Cache MISS:", cacheKey);

    // 2. If not in Redis, get from MongoDB
    const problem = await problemRepository.findById(id);
    if(!problem)  throw new Error("Problem not found");

    // 3. Save Problem in Redis
    await setCache(cacheKey, problem, 300);
    console.log("Problem cached:", cacheKey);

    return problem;
};

const deleteProblem = async (id) => {
    const problem = await problemRepository.deleteById(id);
    if(!problem){
        throw new Error("Problem not found");
    }

    const cacheKey = `problem:${id}`;
    await deleteCache(cacheKey);
    console.log("Problem cache invalidated:", cacheKey);

    // Delete all problem-list caches
    await deleteCachePattern("problems:*");

    console.log("Problem list cache invalidated");

    return problem;
};

module.exports = {
    createProblem, getProblems, getProblemById, updateProblem, deleteProblem
}