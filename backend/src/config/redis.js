const {createClient} = require("redis");

const redisClient = createClient({url: process.env.REDIS_URL || "redis://localhost:6379"})

redisClient.on("error", (error) => {
    console.log("Redis Error:", error.message);
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Redis Connected");
    } catch (error) {
        console.log("Redis Connection Failed:", error.message);
    }
};

module.exports = {
    redisClient, connectRedis
};