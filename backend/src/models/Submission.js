const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        problem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            required: true
        },
        language: {
            type: String,
            enum: ["cpp", "java", "python", "javascript"],
            required: true
        },
        code: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "running", "accepted", "wrong_answer", "runtime_error", "compile_error", "time_limit_exceeded"],
            default: "pending"
        },
        runtime: {
            type: Number,
            default: null
        },
        memory: {
            type: Number,
            default: null
        },
        passedTests: {
            type: Number,
            default: 0
        },
        totalTests: {
            type: Number,
            default: 0
        },
        error: {
            type: String,
            default: null
        }
    }, {
        timestamps: true
    }
)

module.exports = mongoose.model("Submission", submissionSchema);