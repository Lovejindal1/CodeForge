const Problem = require("../models/Problem");

const create = async (data) => {
    return await Problem.create(data);
}

const findAll = async (filter, skip, limit) => {
    return await Problem.find(filter)
        .sort({ problemNumber: 1 })
        .skip(skip)
        .limit(limit)
}

const count = async(filter) => {
    return Problem.countDocuments(filter);
}

const findById = async (id) => {
    return await Problem.findById(id);
};

const deleteById = async (id) => {
    return await Problem.findByIdAndDelete(id);
};

const updateById = async (id, data) => {
    return await Problem.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        }
    );
};

const deleteById = async (id) => {
    return await Problem.findByIdAndDelete(id);
};

module.exports = {
    create, findAll, count, findById, deleteById, updateById
}