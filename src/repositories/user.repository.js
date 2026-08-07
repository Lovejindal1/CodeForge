const User = require("../models/User");

const create = async (data) => {
    return await User.create(data);
}

const findByEmail = async (email) =>{
    return await User.findOne({email});
}

const findById = async (id) => {
    return await User.findById(id).select("-password");
}

const updateProfile = async (id, data) => {
    return await User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    }).select("-password");
}

module.exports = {
    create, findByEmail, findById, updateProfile
}