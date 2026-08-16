
const mongoose = require("mongoose");

const connectDB = async () =>{
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in .env");
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.log("❌ Database Error:", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;