const User = require("../models/User");

const create = async (data) => {
    return await User.create(data);
}

module.exports = {
    create
}