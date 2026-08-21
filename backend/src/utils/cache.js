const {redisClient} = require("../config/redis");

const getCache = async (key) => {
    try {
        const data = await redisClient.get(key);
        if(!data){
            return null;
        }
        return JSON.parse(data);
    } catch (error) {
        console.log("Redis GET Error:", error.message);
        return  null;
    }
}

const setCache = async (key, value, expiry = 300) => {
    try {
        await redisClient.set(key, JSON.stringify(value), {
            EX: expiry
        })
    } catch (error) {
        console.log("Redis SET Error:", error.message);
    }
}

const deleteCache = async (key) => {
    try {
        await redisClient.del(key);
    } catch (error) {
        console.log("Redis DELETE Error:", error.message);
    }
}

const deleteCachePattern = async (pattern) => {
    try {
        let cursor = 0;
        do {
            const result = await redisClient.scan(cursor, { MATCH: pattern, COUNT: 100});
            cursor = result.cursor;
            const keys = result.keys;
            if (keys.length > 0) {
                await redisClient.del(keys);
            }
        } while (cursor !== 0);
    } catch (error) {
        console.log("Redis DELETE PATTERN Error:", error.message);
    }
};


module.exports = {
    getCache, setCache, deleteCache, deleteCachePattern
};