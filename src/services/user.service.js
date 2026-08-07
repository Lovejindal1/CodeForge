const userRepository = require("../repositories/user.repository");

const getCurrentUser = async (userId) =>{
    const user = await userRepository.findById(userId);
    if(!user) {
        throw new Error("User not found!");
    }
    // console.log("User:", user);
    return user;
}

module.exports = {
    getCurrentUser
};