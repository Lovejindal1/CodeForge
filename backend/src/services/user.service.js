const userRepository = require("../repositories/user.repository");
const bcrypt = require("bcrypt");

const getCurrentUser = async (userId) =>{
    const user = await userRepository.findById(userId);
    if(!user) {
        throw new Error("User not found!");
    }
    // console.log("User:", user);
    return user;
}

const updateProfile = async (userId, userData) =>{
    if (!userData.name) {
        throw new Error("Name is required");
    }

    if (userData.name.length < 3) {
        throw new Error("Name must be at least 3 characters");
    }

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

const changePassword = async (userId, passwordData) =>{
    
    if (!passwordData.oldPassword || !passwordData.newPassword) {
        throw new Error(
            "Old password and new password are required"
        );
    }

    if (passwordData.newPassword.length < 8) {
        throw new Error(
            "New password must be at least 8 characters"
        );
    }

    const user = await userRepository.findById(userId);

    
    if(!user) throw new Error("User not found!");   

    //Password needed 
    const userWithPassword = await userRepository.findByEmail(user.email);

    const isMatch = await bcrypt.compare(passwordData.oldPassword, userWithPassword.password);

    if(!isMatch) throw new Error("Old password is incorrect");

    const hashPassword = await bcrypt.hash(passwordData.newPassword, 10);

    await userRepository.updatePassword(userId, hashPassword);

    return ;

}

module.exports = {
    getCurrentUser, updateProfile, changePassword
};