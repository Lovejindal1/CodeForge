const TestCase = require("../models/TestCase");

const create = async (data) => {
    return await TestCase.create(data);
}

const findByProblem = async (problemId) => {
    return await TestCase.find({problem: problemId});
}

const findById = async (id) =>{
    return await TestCase.findById(id);
}

const deleteById = async (id) => {
    return await TestCase.findByIdAndDelete(id);
}

module.exports = {
    create, findByProblem, findById, deleteById
}