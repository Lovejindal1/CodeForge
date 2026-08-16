const mongoose = require("mongoose");
const Problem = require("./Problem");

const testCaseSchema = new mongoose.Schema(
    {
        problem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            require: true
        },
        input: {
            type: String,
            require: true
        },
        expectedOutput: {
            type: String,
            require: true
        },
        isHidden: {
            type: Boolean,
            default: false
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },{
        timestamps: true
    }
);

module.exports = mongoose.model("TestCase", testCaseSchema);