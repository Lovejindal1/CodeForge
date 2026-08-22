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
    user.password = undefined;
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
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "24h"
        }
    );

    user.password = undefined;
    return { user, token };
}

const logout = async (token, user) => {
    if (!token) return true;

    // Calculate remaining seconds until JWT expiration
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const remainingSeconds = user?.exp ? user.exp - nowInSeconds : 86400; // fallback 24h

    if (remainingSeconds > 0) {
        const { setCache } = require("../utils/cache");
        await setCache(`blacklist:${token}`, "revoked", remainingSeconds);
        console.log(`Token blacklisted in Redis for ${remainingSeconds}s`);
    }

    return true;
};

module.exports = {
    register, login, logout
}