const authService = require("../services/auth.service");

const register = async (req,res) => {
    try {
        // console.log(req.body);
        const user = await authService.register(req.body);
        res.status(201).json({
            success: true,
            message: "User Registered",
            data: user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const login = async (req,res) =>{
    try {
        const data = await authService.login(req.body);
        res.status(200).json({
            success: true,
            message: "Login Successful",
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    register, login
}