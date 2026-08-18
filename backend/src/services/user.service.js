const userRepository = require("../repositories/user.repository");
const submissionRepository = require("../repositories/submission.repository");
const problemRepository = require("../repositories/problem.repository");
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
    if(!updatedUser){
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

const getUserDashboard = async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) {
        throw new Error("User not found!");
    }

    // Parallel fetch counts and statistics
    const [
        totalProblems,
        easyTotal,
        mediumTotal,
        hardTotal,
        totalSubmissions,
        acceptedSubmissions,
        wrongAnswerSubmissions,
        compileErrorSubmissions,
        runtimeErrorSubmissions,
        tleSubmissions,
        solvedProblemIds,
        recentSubmissions
    ] = await Promise.all([
        problemRepository.count({}),
        problemRepository.count({ difficulty: "easy" }),
        problemRepository.count({ difficulty: "medium" }),
        problemRepository.count({ difficulty: "hard" }),
        submissionRepository.countByUser(userId),
        submissionRepository.countByUserAndStatus(userId, "accepted"),
        submissionRepository.countByUserAndStatus(userId, "wrong_answer"),
        submissionRepository.countByUserAndStatus(userId, "compile_error"),
        submissionRepository.countByUserAndStatus(userId, "runtime_error"),
        submissionRepository.countByUserAndStatus(userId, "time_limit_exceeded"),
        submissionRepository.findSolvedProblemIdsByUser(userId),
        submissionRepository.findRecentByUser(userId, 8)
    ]);

    // Fetch difficulty breakdown of solved problems
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    if (solvedProblemIds.length > 0) {
        const solvedProblemsDetails = await problemRepository.findByIds(solvedProblemIds, "difficulty");
        solvedProblemsDetails.forEach((prob) => {
            if (prob.difficulty === "easy") easySolved++;
            else if (prob.difficulty === "medium") mediumSolved++;
            else if (prob.difficulty === "hard") hardSolved++;
        });
    }

    const solvedProblems = solvedProblemIds.length;
    const wrongSubmissions = totalSubmissions - acceptedSubmissions;
    const acceptanceRate = totalSubmissions === 0
        ? 0
        : Number(((acceptedSubmissions / totalSubmissions) * 100).toFixed(1));

    return {
        totalSubmissions,
        acceptedSubmissions,
        wrongSubmissions,
        solvedProblems,
        totalProblems,
        acceptanceRate,
        easySolved,
        mediumSolved,
        hardSolved,
        easyTotal,
        mediumTotal,
        hardTotal,
        wrongAnswerSubmissions,
        compileErrorSubmissions,
        runtimeErrorSubmissions,
        tleSubmissions,
        recentSubmissions,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        }
    };
};

module.exports = {
    getCurrentUser, updateProfile, changePassword, getUserDashboard
};