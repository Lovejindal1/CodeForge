const leaderboardService = require("../services/leaderboard.service");

const getContestLeaderboard = async (req, res) => {
    try {
        const leaderboard = await leaderboardService.getContestLeaderboard( req.params.contestId);
        return res.status(200).json({
            success: true,
            data: leaderboard
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

module.exports = {
    getContestLeaderboard
};