const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRepository = require("../repositories/user.repository");

const register = async (userData) =>{
    if (!userData.name || !userData.email || !userData.password) {
        throw new Error("Name, email and password are required");
    }
    if (userData.password.length < 8) {
        throw new Error("Password must be at least 8 characters");
    }
    
    const hashPassword = await bcrypt.hash(userData.password,10);

    userData.password = hashPassword;
    const user = await userRepository.create(userData);
    return user;
}

const login =  async (userData) => {
    const user = await userRepository.findByEmail(userData.email);
    if(!user) {
        throw new Error("User does not exist");
    }

    const isPasswordCorrect = await bcrypt.compare(userData.password,user.password);
    
    if(!isPasswordCorrect) throw new Error("Invalid Password!");

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    )

    user.password = undefined;
    return {user, token};

}

module.exports = {
    register, login
}