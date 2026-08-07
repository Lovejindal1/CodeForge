const userRepository = require("../repositories/user.repository");

const getCurrentUser = async (userId) =>{
    const user = await userRepository.findById(userId);
    if(!user) {
        throw new Error("User not found!");
    }
    // console.log("User:", user);
    return user;
}

const updateProfile = async (userId, userData) =>{
    const updatedUser = await userRepository.updateProfile(userId, 
        {
            name: userData.name
        }
    );
    if(!updateProfile){
        throw new Error("User not found");
    }
    return updatedUser;
}
module.exports = {
    getCurrentUser, updateProfile
};