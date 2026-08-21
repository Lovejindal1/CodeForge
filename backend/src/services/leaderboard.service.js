const leaderboardRepository = require("../repositories/leaderboard.repository");
const ApiError = require("../utils/ApiError");

const getContestLeaderboard = async (contestId) => {

    const contest = await leaderboardRepository.findContestById(contestId);
    if(!contest) throw new ApiError(404, "Contest not found");

    const participantIds = contest.participants.map(participant=>participant._id);
    if (participantIds.length === 0) {
        return [];
    }

    const problemIds = contest.problems;

    const submissions = await leaderboardRepository.findContestSubmissions(problemIds, participantIds, contest.startTime, contest.endTime);
    
    const leaderboardMap = new Map();

    for(const participant of contest.participants){
        leaderboardMap.set(participant._id.toString(), {
            user: {
                _id: participant._id,
                name: participant.name
            },
            solved: 0,
            penalty: 0
        });
    }

    const problemStats = new Map();

    for(const submission of submissions){

        const userId = submission.user.toString();
        const problemId = submission.problem.toString();

        const key = `${userId}_${problemId}`;

        if(!problemStats.has(key)){
            problemStats.set(key, {
                wrongAttempts: 0,
                accepted: false
            })
        }

        const stats = problemStats.get(key);
        if (stats.accepted) continue;

        if(submission.status === "accepted"){
            stats.accepted = true;
            const acceptedTime = Math.floor((submission.createdAt- contest.startTime)/60000);
        
            const penalty = acceptedTime + (stats.wrongAttempts*20);

            const userStats = leaderboardMap.get(userId);

            if(userStats){
                userStats.solved += 1;
                userStats.penalty += penalty;
            }

        } else{
            stats.wrongAttempts += 1;
        }
    }
    const leaderboard = Array.from(leaderboardMap.values());

    leaderboard.sort((a, b) => {
        if(b.solved !== a.solved) return b.solved - a.solved;
        return a.penalty - b.penalty;
    });

    leaderboard.forEach((entry, index) => {
        entry.rank = index + 1;
    });

    return leaderboard;
}

module.exports = {
    getContestLeaderboard
};