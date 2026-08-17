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

const findByIds = async (ids, projection = "difficulty") => {
    return await Problem.find({ _id: { $in: ids } }, projection);
};

module.exports = {
    create, findAll, count, findById, deleteById, updateById, findByIds
}