const userService = require("../services/user.service");

const getCurrentUser = async(req,res)=>{

    try{
        const user = await userService.getCurrentUser(req.user.id);
        res.status(200).json({
            success: true,
            message: "User Found",
            data: user
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const updateProfile = async (req, res) => {

    try {
        const user = await userService.updateProfile(req.user.id, req.body);
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const changePassword = async (req, res) =>{
    try {
        await userService.changePassword(req.user.id, req.body);
        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const getUserDashboard = async (req, res) => {
    try {
        const dashboardData = await userService.getUserDashboard(req.user.id);
        res.status(200).json({
            success: true,
            message: "User dashboard data fetched successfully",
            data: dashboardData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports={ 
    getCurrentUser, updateProfile, changePassword, getUserDashboard
}