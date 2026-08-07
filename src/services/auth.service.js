const bcrypt = require("bcrypt");

const userRepository = require("../repositories/user.repository");

const register = async (userData) =>{
    const hashPassword = await bcrypt.hash(userData.password,10);
    userData.password = hashPassword;
    const user = await userRepository.create(userData);
    return user;
}

module.exports = {
    register
}